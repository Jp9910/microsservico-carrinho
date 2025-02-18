import { NextFunction, Request, Response } from "express"
import ErroNaoEncontrado from "../erros/ErroNaoEncontrado"
import modelCarrinho from "../models/carrinho"

class CarrinhoController {

    // @route GET /carrinhos
    
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    static async listarCarrinhos(req: Request, res: Response, next: NextFunction) {
        try {
            const listaCarrinhos = await modelCarrinho.carrinho.find({})
            res.status(200).json(listaCarrinhos)
        } catch (erro) {
            next(erro)
        }
    }

    // @route POST /carrinhos
    static async cadastrarCarrinho(req: Request, res: Response, next: NextFunction) {
        try {
            const novoCarrinho = await modelCarrinho.carrinho.create(req.body) //precisa remover o campo de cliente?

            // Encontrar o cliente da request e associa-lo ao carrinho
            // ClienteController.atualizarCarrinhoDoClientePorEmail(
            //     req.body.emailCliente,
            //     novoCarrinho
            // )

            res.status(201).json({
                message: "Carrinho criado com sucesso.",
                carrinho: novoCarrinho,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /carrinhos/:id
    static async listarCarrinhoPorId(req: Request, res: Response, next: NextFunction) {
        let carrinhoEncontrado = null
        try {
            carrinhoEncontrado = await modelCarrinho.carrinho.findById(
                req.params.id
            )
            if (carrinhoEncontrado == null) {
                next(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
            }
            res.status(200).json(carrinhoEncontrado)
        } catch (erro) {
            next(erro)
        }
    }

    // @route PUT /carrinhos/:id
    static async atualizarCarrinho(req: Request, res: Response, next: NextFunction) {
        try {
            const carrinhoAntesDeAtualizar =
                await modelCarrinho.carrinho.findByIdAndUpdate(
                    req.params.id,
                    req.body
                )
            if (carrinhoAntesDeAtualizar == null) {
                next(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
            }

            // Atualizar o subdocument do cliente que contém o carrinho
            // const clienteDoCarrinho =
            //     await ClienteController.getClientePorIdDoCarrinho(carrinhoAntesDeAtualizar?.id)
            // if (clienteDoCarrinho) {
            //     ClienteController.atualizarCarrinhoDoClientePorId(
            //         clienteDoCarrinho._id,
            //         req.body
            //     )
            // }

            res.status(200).json({
                message:
                    "Carrinho atualizado com sucesso. Segue o carrinho antigo:",
                carrinho: carrinhoAntesDeAtualizar,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route DELETE /carrinhos/:id
    static async removerCarrinho(req: Request, res: Response, next: NextFunction) {
        try {
            const carrinhoRemovido =
                await modelCarrinho.carrinho.findByIdAndDelete(req.params.id)

            // Remover o subdocument do cliente que contém o carrinho
            // ...

            res.status(200).json({
                message: "Carrinho removido com sucesso.",
                carrinho: carrinhoRemovido,
            })
        } catch (erro) {
            next(erro)
        }
    }
}

export default CarrinhoController



/**
 * Documentação de funções de controller:
 * (fonte: https://stackoverflow.com/questions/27266857/how-to-annotate-express-middlewares-with-jsdoc)
 * 
 * 
 * Com Javascript:
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 *
 * 
 * 
 * Com Typescript:
 * 
 * @typedef {object} showRequestBody
 * @property {string} name this is name in request body
 * @property {number} age this is age in request body
 * 
 * @typedef {object} showRequestQuery
 * @property {string} name this is name in query
 * @property {number} age this is age in query
 * 
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 *
 */