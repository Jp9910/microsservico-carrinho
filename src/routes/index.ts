import express, { Application } from "express"
import rotasCarrinho from "./carrinhoRoutes"
import rotasCliente from "./clienteRoutes"
import rotasPedido from "./pedidoRoutes"

const rotas = (app: Application) => {
    // app.route("/").get(
    //     (req, res) => res.status(200).send("Rota inicial")
    // )

    app.use(
        express.json(), // middleware for json parsing of the request body
        rotasCarrinho,
        rotasCliente,
        rotasPedido
    )
}

export default rotas
