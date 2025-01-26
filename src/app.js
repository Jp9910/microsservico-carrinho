import express from "express"
import conectarBD from "./config/dbconnect.js"
import rotas from "./routes/index.js"

const conexao = await conectarBD()

conexao.on("error", (erro) => {
    console.error("Erro de conexão com o mongo", erro)
})

conexao.once("open", () => {
    console.log("Conectado com o mongo")
})

const app = express()
rotas(app)

// app.get("/produtos/:id", (req,res,next) => {
//     const index = buscarProduto(req.params.id)
//     res.status(200).json(produtos[index])
// })

// app.put("/produtos/:id", (req,res,next) => {
//     const index = buscarProduto(req.params.id)
//     produtos[index].nome = req.body.nome
//     res.status(200).json(produtos)
// })

// app.delete("/produtos/:id", (req,res,next) => {
//     const index = buscarProduto(req.params.id)
//     if (index != -1) {
//         produtos.splice(index, 1)
//     }
//     res.status(200).send("Produto removido")
// })

export default app