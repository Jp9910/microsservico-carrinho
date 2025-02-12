import ErroNaoEncontrado from "../erros/ErroNaoEncontrado.js"

function rotaNotFound (req, res, next) {
    next(new ErroNaoEncontrado()) // passar para o tratador de erros
}

export default rotaNotFound