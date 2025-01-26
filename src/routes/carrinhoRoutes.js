import express from "express"
import CarrinhoController from "../controllers/carrinhoController.js"

const rotasCarrinho = express.Router()

rotasCarrinho.get("/carrinhos", CarrinhoController.listarCarrinhos)

export default rotasCarrinho