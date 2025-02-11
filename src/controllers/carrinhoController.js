import modelCarrinho from "../models/carrinho.js"
import cliente from "../models/cliente.js"
import ClienteController from "./clienteController.js"

class CarrinhoController {
    static async listarCarrinhos(req, res) {
        try {
            const listaCarrinhos = await modelCarrinho.carrinho.find({})
            res.status(200).json(listaCarrinhos)
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição de carrinhos`,
            })
        }
    }

    static async cadastrarCarrinho(req, res) {
        try {
            const novoCarrinho = await modelCarrinho.carrinho.create(req.body) //precisa remover o campo de cliente?

            // Encontrar o cliente da request e associa-lo ao carrinho
            ClienteController.atualizarCarrinhoDoClientePorCpf(
                req.body.cpf_cliente,
                novoCarrinho
            )

            res.status(201).json({
                message: "Carrinho criado com sucesso.",
                carrinho: novoCarrinho,
            })
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha ao cadastrar carrinho`,
            })
        }
    }

    static async listarCarrinhoPorId(req, res) {
        try {
            const carrinhoEncontrado = await modelCarrinho.carrinho.findById(
                req.params.id
            )
            res.status(200).json(carrinhoEncontrado)
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição de carrinho por id`,
            })
        }
    }

    static async atualizarCarrinho(req, res) {
        try {
            const carrinhoAntesDeAtualizar =
                await modelCarrinho.carrinho.findByIdAndUpdate(
                    req.params.id,
                    req.body
                )
            const clienteDoCarrinho =
                await ClienteController.getClientePorIdDoCarrinho(req.params.id)
            ClienteController.atualizarCarrinhoDoClientePorId(
                clienteDoCarrinho._id,
                req.body
            )
            res.status(200).json({
                message:
                    "Carrinho atualizado com sucesso. Segue o carrinho antigo:",
                carrinho: carrinhoAntesDeAtualizar,
            })
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na atualização de carrinho`,
            })
        }
    }

    static async removerCarrinho(req, res) {
        try {
            const carrinhoRemovido =
                await modelCarrinho.carrinho.findByIdAndDelete(req.params.id)
            res.status(200).json({
                message: "Carrinho removido com sucesso.",
                carrinho: carrinhoRemovido,
            })
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na remoção de carrinho`,
            })
        }
    }
}

export default CarrinhoController
