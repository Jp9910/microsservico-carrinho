import { NextFunction, Request, Response } from "express"
import ErroNaoEncontrado from "../erros/ErroNaoEncontrado.js"

function rotaNotFound(req: Request, res: Response, next: NextFunction) {
    next(new ErroNaoEncontrado()) // passar para o tratador de erros
}

export default rotaNotFound