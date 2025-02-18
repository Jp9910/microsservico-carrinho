import ErroGenerico from "./ErroGenerico";

class ErroBadRequest extends ErroGenerico {
    constructor () {
        super("Dados fornecidos estão incorretos", 400)
    }
}

export default ErroBadRequest