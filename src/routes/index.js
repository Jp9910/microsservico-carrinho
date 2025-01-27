import express from "express";
import rotasCarrinho from "./carrinhoRoutes.js";
import rotasCliente from "./clienteRoutes.js"

const rotas = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Rota inicial"));

    app.use(express.json(), rotasCarrinho, rotasCliente) // middleware for json parsing of the request body

    // app.use(carrinhos)
};

export default rotas;
