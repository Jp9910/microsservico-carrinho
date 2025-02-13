import ErroNaoEncontrado from "../erros/ErroNaoEncontrado.js"
import pedido from "../models/pedido.js"

class PedidoController {

    // @route POST /pedidos
    static async cadastrarPedido(req, res, next) {
        console.log(req.body)
        try {
            const novoPedido = await pedido.create(req.body)
            res.status(201).json({
                message: "Pedido cadastrado com sucesso.",
                pedido: novoPedido,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /pedidos
    static async getPedidosPorEmail(req, res, next) {
        let pedidos = []
        try {
            pedidos = await pedido.find({"emailCliente": req.query.emailCliente})
            res.status(200).json(pedidos)
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /pedidos/:id
    static async getPedidoPorId(req, res, next) {
        let pedidoEncontrado = null
        try {
            pedidoEncontrado = await pedido.findById(
                req.params.id
            )
            if (pedidoEncontrado == null) {
                next(new ErroNaoEncontrado("Pedido não encontrado com este ID"))
            }
            res.status(200).json(pedidoEncontrado)
        } catch (erro) {
            next(erro)
        }
    }
}

export default PedidoController