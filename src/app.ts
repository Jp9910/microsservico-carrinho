/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application } from "express"
import conectarBD from "./config/dbconnect"
import rotas from "./routes/index"
import tratadorDeErros from "./middlewares/tratadorDeErros"
import rotaNotFound from "./middlewares/rotaNotFound"
import startConsumidorDeFilas from './mensageria/consumidor';

// startConsumidorDeFilas(); // basta não usar o await na função que ela já roda como se fosse numa outra thread

async function conectarComBancoDeDados() {
    const conexao = await conectarBD()
    conexao.on("error", (erro) => {
        console.error("Erro de conexão com o mongo", erro)
    })
    conexao.once("open", () => {
        console.log("Conectado com o mongo")
    })
}
conectarComBancoDeDados().catch(err => console.log(err));;


// app: express.Express seria a mesma coisa?
const app: Application = express()

// Registrar (middleware) que ligará as rotas aos métodos dos controllers
rotas(app)
app.use(rotaNotFound) // depois da declaração das rotas

// Middleware para tratar erros:
app.use(tratadorDeErros)


// Exemplo de middleware para qualquer requisição e rota:
app.use((req,res, next) => {
    console.log("0-Ponto de entrada")
    next()
})
app.all("*",(req,res, next) => {
    console.log("0.1-Ponto de entrada")
    next()
})

// Exemplo de middleware para qualquer requisição GET:
app.get("*", (req,res, next) => {
    console.log("0.2-Middleware para rotas GET")
    next()
})
app.post("*", (req,res, next) => {
    console.log("0.2-Middleware para rotas POST")
    next()
})

// Exemplo de middlewares para verbos e rotas específica:
app.use("/rotateste", (req, res, next) => {
    console.log("1-Primeiro middleware na rota teste")
    next()
})
app.post("/rotateste", (req, res, next) => {
    console.log("2-Middleware apenas para POST da rota teste")
    next()
})
app.get("/rotateste", (req, res, next) => {
    console.log("3-Middleware apenas para GET na rota teste")
    next()
})
app.use("/rotateste", (req, res, next) => {
    console.log("4-Quarto middleware na rota teste")
    next()
})
app.use("/rotateste", (req, res, next) => {
    console.log("5-Middleware que estabelece uma Response")
    res.status(200).send({resposta: "teste"})
    next()
})
app.use("/rotateste", (req, res, next) => {
    console.log("6-Middleware final da rota teste")
})
app.use("/rotateste", (req, res, next) => {
    console.log("7-Esse middleware não será executado pois está depois de um middleware que não usou next()")
    next()
})

export default app


// Importante:
// Tudo no ExpressJs é um middleware.
// Uma aplicação Express é essencialmente composta pela execução de várias funções middlewares em resposta às requisições!
// Explicação dos middlewares no expressjs: https://cursos.alura.com.br/course/node-js-buscas-filtros-paginacao-erros-api/task/124391


// registro de usuário no express
//https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d

// Verificar bd
// https://cloud.mongodb.com/v2#/org/6795befcadf5607dc9f75200/projects