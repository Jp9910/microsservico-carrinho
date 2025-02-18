import express from "express"
import PedidoController from "../controllers/pedidoController.js"

const rotasPedido = express.Router()

rotasPedido.get("/pedidos", PedidoController.getPedidosPorEmail)
rotasPedido.get("/pedidos/:id", PedidoController.getPedidoPorId)
rotasPedido.post("/pedidos", PedidoController.cadastrarPedido)

export default rotasPedido
