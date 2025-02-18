import express from "express"
import CarrinhoController from "../controllers/carrinhoController"

const rotasCarrinho = express.Router()

rotasCarrinho.get("/carrinhos", CarrinhoController.listarCarrinhos)
rotasCarrinho.get("/carrinhos/:id", CarrinhoController.listarCarrinhoPorId)
rotasCarrinho.post("/carrinhos", CarrinhoController.cadastrarCarrinho)
rotasCarrinho.put("/carrinhos/:id", CarrinhoController.atualizarCarrinho)
rotasCarrinho.delete("/carrinhos/:id", CarrinhoController.removerCarrinho)

export default rotasCarrinho
