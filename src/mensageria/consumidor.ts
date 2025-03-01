import amqp from 'amqplib';
import "dotenv/config";
import modelCarrinho from "../models/carrinho"
import IMensagemCarrinhoComprado from '../types/mensagemCarrinhoComprado';

const fila = "filaCarrinhosComprados";
const exchange = "exchangePedidosFeitos";
let tentativaConexao = 0;

export default async function startConsumidor() {
    try {
        tentativaConexao += 1;
        console.log(`➡️ [Consumidor] Tentativa ${tentativaConexao} - Conectando com o RabbitMQ...`);
        const conexao = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: Number(process.env.RABBITMQ_PORT) || 5672,
            username: process.env.RABBITMQ_USERNAME || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
            frameMax: 0,
            heartbeat: 10,
            vhost: '/',
        });
        tentativaConexao = 0;

        conexao.on("error", (err) => {
            console.error("🔴 [Consumidor] Erro na conexão com o RabbitMQ: ", err.message);
            reconectar();
        });

        conexao.on("close", () => {
            console.error("🔴 [Consumidor] Conexão RabbitMQ fechada.");
            reconectar();
        });

        console.log("✅ [Consumidor] Conexão criada...\n");
        const canal = await conexao.createChannel();
        await canal.assertQueue(fila, { durable: true });
        await canal.assertExchange(exchange, 'fanout', { durable: true });
        await canal.bindQueue(fila, exchange, '');

        console.log("➡️ [Consumidor] Escutando por mensagens...");

        canal.consume(fila, async (msg) => {
            if (msg !== null) {
                const conteudo = msg.content.toString();
                console.log(`📨 [Consumidor] Mensagem Recebida: ${conteudo}`);
                const msgCarrinhoComprado: IMensagemCarrinhoComprado = JSON.parse(conteudo);
                console.log("id carrinho recebido:",msgCarrinhoComprado.IdCarrinho);
                // Em vez de só buscar, o carrinho deve ser deletado. Mas por enquanto vou deixar assim pra n ter que ficar criando outro
                const carrinhoRemovido = await modelCarrinho.carrinho.findByIdAndDelete(msgCarrinhoComprado.IdCarrinho)
                console.log("Carrinho removido:", carrinhoRemovido);
                canal.ack(msg);
            }
        }, { noAck: false });
        /**
         * Sobre o noAck:
         * if true, the broker won’t expect an acknowledgement of messages delivered to this
         * consumer; i.e., it will dequeue messages as soon as they’ve been sent down the wire. 
         * Defaults to false (i.e., you will be expected to acknowledge messages).
         */

    } catch (error:unknown) {
        console.error('🔴 [Consumidor] Erro:', error);
        reconectar();
    }
}

async function reconectar() {
    console.log("⚠️ [Consumidor] Tentando reconexão em 5 segundos...");
    setTimeout(startConsumidor, 5000);
}