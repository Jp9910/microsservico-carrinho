import cliente from "../models/cliente.js"
import ErroBadRequest from "../erros/ErroBadRequest.js"

class ClienteController {
    // @route GET /clientes
    static async listarClientes(req, res, next) {
        try {
            // essa paginação pode ser feita em forma de middleware para reaproveitar o código em outras rotas, passando
            // a informação da query no objeto request (req)
            let { limite = 5, pagina = 1, ordenarPor = "_id", ordem = -1 } = req.query // queries para paginação
            limite = parseInt(limite)
            pagina = parseInt(pagina)
            ordem = parseInt(ordem)

            if (pagina < 1 || limite < 1) {
                throw new ErroBadRequest()
            }
            const listaClientes = await cliente
                .find() // pegar todos os documentos
                .sort({[ordenarPor] : ordem}) // colocar a variavel entre [] permite usa-la como variável pra nomear a propriedade do objeto
                .skip((pagina - 1) * limite) // pular certa quantidade de documentos de acordo com a paginação
                .limit(limite) // pegar apenas X quantidade de documentos
            res.status(200).json(listaClientes)
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /clientes/busca
    static async listarClientesPorBusca(req, res, next) {
        //Operadores do mongoose: https://www.mongodb.com/docs/manual/reference/operator/query/
        try {
            const busca = {
                email: { $regex: req.query.email, $options: "i" },
            }
            const clientesResultado = await cliente.find(busca)
            res.status(200).send(clientesResultado)
        } catch (erro) {
            next(erro)
        }
    }

    // @route POST /clientes
    static async cadastrarCliente(req, res, next) {
        try {
            const novoCliente = await cliente.create(req.body)
            res.status(201).json({
                message: "Cliente criado com sucesso.",
                cliente: novoCliente,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /clientes/:id
    static async listarClientePorId(req, res, next) {
        try {
            const clienteEncontrado = await cliente.findById(req.params.id)
            res.status(200).json(clienteEncontrado)
        } catch (erro) {
            next(erro)
        }
    }

    // @route PUT /clientes/:id
    static async atualizarCliente(req, res, next) {
        try {
            const clienteAtualizado = await cliente.findByIdAndUpdate(
                req.params.id,
                req.body
            )
            res.status(200).json({
                message: "Cliente atualizado com sucesso.",
                cliente: clienteAtualizado,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route DELETE /clientes/:id
    static async removerCliente(req, res, next) {
        try {
            const clienteRemovido = await cliente.findByIdAndDelete(
                req.params.id
            )
            res.status(200).json({
                message: "Cliente removido com sucesso.",
                cliente: clienteRemovido,
            })
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarCarrinhoDoClientePorCpf(cpfCliente, carrinho) {
        const clienteDoCarrinho = await this.getClientePorCpf(cpfCliente)
        // Juntar os dados do carrinho ao cliente
        const clienteMaisCarrinho = {
            ...clienteDoCarrinho._doc, // O banco retorna também o id do objeto, que não é necessário. As informações necessarias estão na variavel _doc
            carrinho: { ...carrinho },
        }
        await cliente.findByIdAndUpdate(
            clienteDoCarrinho._id,
            clienteMaisCarrinho
        )
    }

    static async atualizarCarrinhoDoClientePorId(idCliente, carrinho) {
        // console.log(idCliente)
        const clienteDoCarrinho = await cliente.findById(idCliente)
        // Juntar os dados do carrinho ao cliente
        const clienteMaisCarrinho = {
            ...clienteDoCarrinho._doc,
            carrinho: { ...carrinho },
        }
        await cliente.findByIdAndUpdate(
            clienteDoCarrinho._id,
            clienteMaisCarrinho
        )
    }

    static async getClientePorCpf(cpf) {
        try {
            const clienteEncontrado = await cliente.findOne({ cpf: cpf })
            return clienteEncontrado
        } catch (erro) {
            console.log(erro.message)
        }
    }

    static async getClientePorIdDoCarrinho(idCarrinho) {
        try {
            const clienteEncontrado = await cliente.findOne({
                "carrinho._id": idCarrinho,
            })
            return clienteEncontrado
        } catch (erro) {
            console.log(erro.message)
        }
    }
}

export default ClienteController
