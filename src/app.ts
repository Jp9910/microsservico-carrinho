import express from "express"
import conectarBD from "./config/dbconnect.js"
import rotas from "./routes/index.js"
import tratadorDeExceptions from "./middlewares/tratadorDeExceptions.js"

const conexao = await conectarBD()

conexao.on("error", (erro: any) => {
    console.error("Erro de conexão com o mongo", erro)
})

conexao.once("open", () => {
    console.log("Conectado com o mongo")
})
// Verificar bd
// https://cloud.mongodb.com/v2#/org/6795befcadf5607dc9f75200/projects
const app = express()
rotas(app)

// middleware customizado para tratar erros:
app.use(tratadorDeExceptions)

export default app

// registro de usuário no express
//https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
