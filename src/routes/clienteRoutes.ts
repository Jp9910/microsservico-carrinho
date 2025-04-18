import express from "express"
import ClienteController from "../controllers/clienteController.js"

// Um roteador do Express basicamente serve para registrar um grupo de middlewares para determinadas
// rotas e métodos HTTP, para organizar melhor a aplicação.
const rotasCliente = express.Router()

rotasCliente.get("/clientes", ClienteController.listarClientes)
// Definir o /clientes/busca antes do /clientes/:id pra não considerar /busca como um id
rotasCliente.get("/clientes/busca", ClienteController.listarClientesPorBusca)
rotasCliente.get("/clientes/:id", ClienteController.listarClientePorId)
rotasCliente.post("/clientes", ClienteController.cadastrarCliente)
rotasCliente.put("/clientes/:id", ClienteController.atualizarCliente)
rotasCliente.delete("/clientes/:id", ClienteController.removerCliente)

export default rotasCliente
