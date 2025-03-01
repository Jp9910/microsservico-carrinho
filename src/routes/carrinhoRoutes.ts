import express from "express"
import CarrinhoController from "../controllers/carrinhoController"

const rotasCarrinho = express.Router()

rotasCarrinho.get("/carrinhos", CarrinhoController.listarCarrinhos)
rotasCarrinho.post("/carrinhos/adicionarProduto", CarrinhoController.adicionarProduto)
rotasCarrinho.get("/carrinhos/buscar", CarrinhoController.listarCarrinhoPorEmailOuCookie)
rotasCarrinho.get("/carrinhos/:id", CarrinhoController.listarCarrinhoPorId)
rotasCarrinho.post("/carrinhos", CarrinhoController.cadastrarCarrinho)
rotasCarrinho.post("/carrinhos/comprar/:id", CarrinhoController.comprarCarrinho)
rotasCarrinho.put("/carrinhos/sincronizarCarrinhos", CarrinhoController.sincronizarCarrinhos)
rotasCarrinho.put("/carrinhos/:id", CarrinhoController.atualizarCarrinho)
rotasCarrinho.patch("/carrinhos/removerProduto", CarrinhoController.removerProduto)
rotasCarrinho.delete("/carrinhos/removerTodos", CarrinhoController.removerTodosOsCarrinhos)
rotasCarrinho.delete("/carrinhos/:id", CarrinhoController.removerCarrinho)

export default rotasCarrinho
