import ErroGenerico from "./ErroGenerico";

class ErroDeValidacao extends ErroGenerico {
    constructor(erro: any) {
        const mensagensDeErros = Object.values(erro.errors).map((erro: any) => erro.message).join("; ")
        super(`Erros de validação: ${mensagensDeErros}`, 400)
    }
}

export default ErroDeValidacao