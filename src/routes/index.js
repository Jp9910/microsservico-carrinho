import express from "express"
import rotasCarrinho from "./carrinhoRoutes.js"
import rotasCliente from "./clienteRoutes.js"

const rotas = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Rota inicial"))

    app.use(
        express.json(), // middleware for json parsing of the request body
        rotasCarrinho,
        rotasCliente
    )
}

export default rotas
