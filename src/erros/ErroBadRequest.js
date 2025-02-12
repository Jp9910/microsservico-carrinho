import ErroGenerico from "./ErroGenerico.js";

class ErroBadRequest extends ErroGenerico {
    constructor () {
        super("Dados fornecidos estão incorretos", 400)
    }
}

export default ErroBadRequest