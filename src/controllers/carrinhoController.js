import modelCarrinho from "../models/carrinho.js"
import ClienteController from "./clienteController.js"

class CarrinhoController {
    static async listarCarrinhos(req, res, next) {
        try {
            const listaCarrinhos = await modelCarrinho.carrinho.find({})
            res.status(200).json(listaCarrinhos)
        } catch (erro) {
            next(erro)
        }
    }

    static async cadastrarCarrinho(req, res, next) {
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
            next(erro)
        }
    }

    static async listarCarrinhoPorId(req, res, next) {
        let carrinhoEncontrado = null
        try {
            carrinhoEncontrado = await modelCarrinho.carrinho.findById(
                req.params.id
            )
            if (carrinhoEncontrado == null) {
                res.status(400).json("Carrinho não encontrado com este ID")
                return
            }
            res.status(200).json(carrinhoEncontrado)
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarCarrinho(req, res, next) {
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
            next(erro)
        }
    }

    static async removerCarrinho(req, res, next) {
        try {
            const carrinhoRemovido =
                await modelCarrinho.carrinho.findByIdAndDelete(req.params.id)
            res.status(200).json({
                message: "Carrinho removido com sucesso.",
                carrinho: carrinhoRemovido,
            })
        } catch (erro) {
            next(erro)
        }
    }
}

export default CarrinhoController
