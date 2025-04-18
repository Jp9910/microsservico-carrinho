import amqp from 'amqplib';
import "dotenv/config"
import { Options } from 'amqplib/properties';
import IPedidoEnviado from '../types/pedidoEnviado';

// RabbitMQ node tutorials: https://github.com/amqp-node/amqplib/tree/main/examples/tutorials

// O Mensageiro não está sendo usado nesse projeto. O pedido está sendo feito diretamente para loja
// Mas vou deixar aqui para referência futura de como implementar publicação de mensagem no javascript
export default class Mensageiro {

    private static _instance: Mensageiro;
    conexao: amqp.Connection|null = null;
    canal: amqp.Channel|null = null;
    jaEstaTentandoReconectar = false; // essa flag teria que ser um mutex, mas aí ja foge do escopo do projeto
    jaEstaTentandoRecriarCanal = false;
    bufferDeMensagens: IPedidoEnviado[] = []; // poderia salvar esse buffer num arquivo pra garantir que não vai perder os dados caso o processo caia
    fila = "filaPedidosFeitos";
    exchange = "exchangePedidosFeitos";
    tentativaConexao = 0;
    parametrosConexao: Options.Connect = {
        protocol: 'amqp',
        hostname: process.env.RABBITMQ_HOST || 'localhost',
        port: Number(process.env.RABBITMQ_PORT) || 5672,
        username: process.env.RABBITMQ_USERNAME || 'guest',
        password: process.env.RABBITMQ_PASSWORD || 'guest',
        frameMax: 0,
        heartbeat: 10,
        vhost: '/',
    }

    private constructor() {}

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    async enviarPedido (pedido: IPedidoEnviado) {
        if (!this.conexao) {
            console.log("⚠️ Conexão não disponível. Salvando mensagem em buffer...");
            // Salvar mensagem em buffer caso a conexão não esteja estabelecida.
            this.bufferDeMensagens.push(pedido);
            return this.reconectar();
        }

        if (!this.canal) {
            console.log("⚠️ Canal não disponível. Salvando mensagem em buffer...");
            this.bufferDeMensagens.push(pedido);
            return this.criarCanal();
        }

        this.canal!.publish(this.exchange, "", Buffer.from(JSON.stringify(pedido)), { persistent: true });
        console.log("✅ Mensagem enviada: ", pedido);
    }

    async conectar() {

        if (this.conexao) return;

        this.tentativaConexao += 1
        console.log(`Tentativa ${this.tentativaConexao} - Conectando o sender ao RabbitMQ...`);

        try {
            this.conexao = await amqp.connect(this.parametrosConexao);
        } catch (erro: unknown) {
            console.error("Erro ao conectar ao RabbitMQ: ", erro)
            this.jaEstaTentandoReconectar = false;
            return this.reconectar()
        }

        // Listen for connection errors
        this.conexao.on("error", (err) => {
            console.error("🔴 Erro na conexão com o RabbitMQ: ", err.message);
            console.log("Reconectando...");
            this.reconectar();
        });

        // Listen for connection closure
        this.conexao.on("close", () => {
            console.error("🔴 Conexão RabbitMQ fechada. Reconectando...");
            this.reconectar();
        });

        console.log("✅ Mensageiro conectado ao RabbitMQ!");
        this.tentativaConexao = 0;
        this.jaEstaTentandoReconectar = false;

        this.criarCanal();
    }

    async criarCanal() {
        if (this.canal || !this.conexao) return

        console.log("Criando canal...");

        try {
            this.canal = await this.conexao!.createChannel();
        } catch (erro: unknown) {
            console.error("Erro ao criar canal: ", erro)
            this.jaEstaTentandoRecriarCanal = false;
            return this.recriarCanal();
        }

        // >>Importante: Canais geralmente só falham por falhas lógicas de programação, então talvez seja até melhor não tentar recriar o canal.
        this.canal.on("error", (err) => {
            console.error("🔴 Erro no canal:", err.message);
            this.recriarCanal();
        });
        
        this.canal.on("close", () => {
            console.error("🔴 Canal foi fechado.");
            this.recriarCanal();
        });

        // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
        await this.canal.assertQueue(this.fila, { durable: true });

        // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
        await this.canal.assertExchange(this.exchange, 'fanout', { durable: true });

        // https://amqp-node.github.io/amqplib/channel_api.html#channel_bindQueue
        await this.canal.bindQueue(this.fila, this.exchange, "");

        console.log("✅ Canal criado...")
        this.jaEstaTentandoRecriarCanal = false;

        // Após criar, enviar possíveis mensagens no buffer
        this.flushMessageQueue();
    }

    async reconectar() {
        if (this.jaEstaTentandoReconectar) {console.log("dispensando reconexão"); return;}
        this.jaEstaTentandoReconectar = true;
        this.conexao = null;
        this.canal = null;

        // Dá pra reconectar automaticamente com a próxima linha, mas não é necessário, pq
        // a próxima chamada pra enviarPedido() já vai acionar a conexão, já que canal e conexao vao ser = null
        console.log("Tentando reconexão em 5 segundos...");
        setTimeout(this.conectar.bind(this), 5000);
    }
    
    async recriarCanal() {
        if (this.jaEstaTentandoRecriarCanal) {console.log("dispensando recriação de canal"); return;}
        this.jaEstaTentandoRecriarCanal = true;
        this.canal = null
        console.log("Tentando recriar canal em 5 segundos...");
        setTimeout(this.criarCanal.bind(this), 5000);
    }

    // Enviar mensagens no buffer. Chamado quando a conexão é (re)estabelecida
    async flushMessageQueue() {
        while (this.bufferDeMensagens.length > 0) {
            const pedido = this.bufferDeMensagens.shift();
            // Publish the message after reconnecting
            await this.enviarPedido(pedido!);
            console.log(`📩 Flushed message ${pedido}`);
        }
    }
}
