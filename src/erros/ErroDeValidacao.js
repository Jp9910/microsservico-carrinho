import ErroGenerico from "./ErroGenerico.js";

class ErroDeValidacao extends ErroGenerico {
    constructor(erro) {
        const mensagensDeErros = Object.values(erro.errors).map(erro => erro.message).join("; ")
        super(`Erros de validação: ${mensagensDeErros}`, 400)
    }
}

export default ErroDeValidacao