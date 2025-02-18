import mongoose from "mongoose"
import ErroGenerico from "../erros/ErroGenerico.js"
import ErroDeValidacao from "../erros/ErroDeValidacao.js"
import ErroBadRequest from "../erros/ErroBadRequest.js"
import { NextFunction, Request, Response, ErrorRequestHandler } from "express"

// Middleware especial do Express caracterizado por receber quatro parâmetros. (erro, req, res e next)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tratadorDeErros(erro:ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    if (erro instanceof mongoose.Error.CastError) {
        new ErroBadRequest().enviarResposta(res)
    } else if (erro instanceof mongoose.Error.ValidationError) {
        new ErroDeValidacao(erro).enviarResposta(res)
    } else if (erro instanceof ErroGenerico) {
        erro.enviarResposta(res)
    } else {
        console.error(erro)
        new ErroGenerico().enviarResposta(res)
    }
}

export default tratadorDeErros


// Outros exemplos: https://expressjs.com/en/guide/using-middleware.html