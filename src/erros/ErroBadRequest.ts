import ErroGenerico from "./ErroGenerico";

class ErroBadRequest extends ErroGenerico {
    constructor (erro:string = "Dados fornecidos estão incorretos") {
        super(erro, 400)
    }
}

export default ErroBadRequest