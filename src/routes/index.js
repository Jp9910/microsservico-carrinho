import express from "express";
import rotasCarrinhos from "./carrinhoRoutes.js";

const rotas = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Rota inicial"));
    app.use(express.json(), rotasCarrinhos) // middleware for json parsing of the request body

    // app.use(carrinhos)
};

export default rotas;
