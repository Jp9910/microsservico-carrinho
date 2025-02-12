import cliente from "../models/cliente.js"

class ClienteController {

    // @route GET /clientes
    static async listarClientes(req, res, next) {
        try {
            const listaClientes = await cliente.find({})
            res.status(200).json(listaClientes)
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
