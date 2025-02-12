import ErroGenerico from "./ErroGenerico.js";

class ErroNaoEncontrado extends ErroGenerico {

    constructor(mensagem = "Contéudo não encontrado", statusCode = 404) {
        super(mensagem, statusCode)
    }
}

export default ErroNaoEncontrado