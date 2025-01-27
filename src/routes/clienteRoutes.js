import express from "express"
import ClienteController from "../controllers/clienteController.js"

const rotasCliente = express.Router()

rotasCliente.get("/clientes", ClienteController.listarClientes)
rotasCliente.get("/clientes/:id", ClienteController.listarClientePorId)
rotasCliente.post("/clientes", ClienteController.cadastrarCliente)
rotasCliente.put("/clientes/:id", ClienteController.atualizarCliente)
rotasCliente.delete("/clientes/:id", ClienteController.removerCliente)

export default rotasCliente