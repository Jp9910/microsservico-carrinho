import express from "express"
import rotasCarrinho from "./carrinhoRoutes.js"
import rotasCliente from "./clienteRoutes.js"
import rotasPedido from "./pedidoRoutes.js"

const rotas = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Rota inicial"))

    app.use(
        express.json(), // middleware for json parsing of the request body
        rotasCarrinho,
        rotasCliente,
        rotasPedido
    )
}

export default rotas
