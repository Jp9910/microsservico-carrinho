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
// Verificar bd
// https://cloud.mongodb.com/v2#/org/6795befcadf5607dc9f75200/projects
const app = express()
rotas(app)

// app.delete("/produtos/:id", (req,res,next) => {
//     const index = buscarProduto(req.params.id)
//     if (index != -1) {
//         produtos.splice(index, 1)
//     }
//     res.status(200).send("Produto removido")
// })

export default app