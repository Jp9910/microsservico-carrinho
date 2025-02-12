import mongoose from "mongoose"
import ErroGenerico from "../erros/ErroGenerico.js"
import ErroDeValidacao from "../erros/ErroDeValidacao.js"
import ErroBadRequest from "../erros/ErroBadRequest.js"
import ErroNaoEncontrado from "../erros/ErroNaoEncontrado.js"

// Middleware especial do Express caracterizado por receber quatro parâmetros. (erro, req, res e next)
// eslint-disable-next-line no-unused-vars
function tratadorDeErros(erro, req, res, next) {
    if (erro instanceof mongoose.Error.CastError) {
        new ErroBadRequest().enviarResposta(res)
    } else if (erro instanceof mongoose.Error.ValidationError) {
        new ErroDeValidacao(erro).enviarResposta(res)
    } else if (erro instanceof ErroNaoEncontrado) {
        erro.enviarResposta(res)
    } else {
        console.error(erro)
        new ErroGenerico().enviarResposta(res)
    }
}

export default tratadorDeErros


// Outros exemplos: https://expressjs.com/en/guide/using-middleware.html