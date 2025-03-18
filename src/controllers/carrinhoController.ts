import { NextFunction, Request, Response } from "express"
import ErroNaoEncontrado from "../erros/ErroNaoEncontrado"
import modelCarrinho from "../models/carrinho"
import IPedidoEnviado from "../types/pedidoEnviado"
import Mensageiro from "../mensageria/mensageiro"
import ErroBadRequest from "../erros/ErroBadRequest"

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

    // @route POST /comprarCarrinho/:id
    static async comprarCarrinho(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Pedido Recebido");
            const carrinho = await modelCarrinho.carrinho.findById(req.params.id)
            if (carrinho == null) {
                throw(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
            }

            const arrayDeIds: Array<number> = [];
            carrinho?.produtos.forEach(produto => {
                arrayDeIds.push(produto.id)
            });

            const pedido = {EmailCliente: carrinho?.emailCliente, IdsProdutos: arrayDeIds, IdCarrinho: carrinho._id.toString()} as IPedidoEnviado
            await Mensageiro.Instance.enviarPedido(pedido)
            // await carrinho?.deleteOne(); // da pra deletar ou apenas setar "comprado" pra true
            res.status(200).json({
                message: "Compra está sendo processada.",
                pedido: pedido,
            })
        } catch (erro) {
            next(erro)
        }
    }

    static async listarCarrinhoPorEmailOuCookie(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.query.emailCliente || req.query.email
            const cookie = req.query.cookieCliente || req.query.cookie

            // if (!email && !cookie) throw new ErroBadRequest("Nenhum email ou cookie foi passado na requisição")
            if (!email && !cookie) {
                res.status(200).json(null)
                return
            }

            const busca = email ? {emailCliente : email} : {cookieCliente : cookie}
            // console.log(busca)
            const carrinho = await modelCarrinho.carrinho.findOne(busca)
            // if (carrinho == null) throw(new ErroNaoEncontrado("Nenhum carrinho associado a este email ou cookie"))
            res.status(200).json(carrinho)
        } catch (erro) {
            next(erro)
        }
    }

    // @route POST /carrinhos/adicionarProduto
    static async adicionarProduto(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Adicionar produto")
            // console.log(req.body)
            const email = req.body.emailCliente || req.body.email
            const cookie = req.body.cookieCliente || req.body.cookie
            // if (!email && !cookie) throw new ErroBadRequest("Nenhum email ou cookie foi passado na requisição")
            if (!email && !cookie) {
                throw(new ErroBadRequest("Nenhum email ou cookie foi passado na requisição"))
            }
            const busca = email ? {emailCliente : email} : {cookieCliente : cookie}
            // console.log(busca)
            let carrinho = await modelCarrinho.carrinho.findOne(busca)
            if (carrinho == null) {
                // criar novo carrinho com nenhum produto
                carrinho = await modelCarrinho.carrinho.create({
                    emailCliente: email, 
                    cookieCliente: cookie,
                    produtos: []
                })
            }
            // adicionar o produto ao carrinho
            carrinho.produtos.push(req.body.produto)
            carrinho.save()
            res.status(200).json({
                message:
                    "Produto adicionado ao carrinho.",
                carrinho: carrinho,
            })
        } catch (erro) {
            next(erro)
        }
    }

    /**
     * @route PATCH /carrinhos/removerProduto
     * @param req Express.Request
     * @param res Express.Response
     * @param next Express.NextFunction
     */ 
    static async removerProduto(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Remover produto")
            // console.log(req.body)
            const email = req.body.emailCliente || req.body.email
            const cookie = req.body.cookieCliente || req.body.cookie
            const idProduto = req.body.IdProduto
            // if (!email && !cookie) throw new ErroBadRequest("Nenhum email ou cookie foi passado na requisição")
            if (!email && !cookie) {
                throw(new ErroBadRequest("Nenhum email ou cookie foi passado na requisição"))
            }
            if (!idProduto) {
                throw(new ErroBadRequest("Nenhum id do produto foi passado na requisição"))
            }
            const busca = email ? {emailCliente : email} : {cookieCliente : cookie}
            const carrinho = await modelCarrinho.carrinho.findOne(busca)
            if (!carrinho) {
                throw(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
            }
            // remover produto
            carrinho.produtos = carrinho.produtos.filter((prod) => prod.id !== idProduto)
            carrinho.save()
            res.status(204).json({
                message:
                    "Produto removido do carrinho.",
                carrinho: carrinho,
            })
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
                throw(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
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
                throw(new ErroNaoEncontrado("Carrinho não encontrado com este ID"))
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

    // @route PUT /carrinhos/sincronizarCarrinhos
    static async sincronizarCarrinhos(req: Request, res: Response, next: NextFunction) {
        try {
            // TODO: Considerar o caso de ter carrinho por cookie, mas não ter por email
            console.log("Sincronizar carrinhos")
            const email = req.query.emailCliente || req.query.email
            const cookie = req.query.cookieCliente || req.query.cookie
            // console.log(email, cookie)
            if (!email || !cookie) throw(new ErroBadRequest("Email e cookie são necessários para sincronizar os carrinhos"))

            let mensagem = "Nenhuma ação necessária."

            let carrinho
            const carrinhoEmail = await modelCarrinho.carrinho.findOne({emailCliente : email})
            const carrinhoCookie = await modelCarrinho.carrinho.findOne({cookieCliente : cookie})
            console.log("carrinho cookie:",carrinhoCookie,"\ncarrinho email:", carrinhoEmail)
            if (carrinhoEmail && carrinhoCookie) {
                // caso o email ja tenha carrinho, atualizar com o novo
                // (a prioridade é para o carrinho de cookie, pois provavelmente é o carrinho mais atual do usuario)
                carrinho = await modelCarrinho.carrinho.findOneAndUpdate(
                    {emailCliente : email},
                    req.body
                )
                if (carrinhoEmail._id.toString() !== carrinhoCookie._id.toString()) {
                    await modelCarrinho.carrinho.findByIdAndDelete(carrinhoCookie._id)
                }
                mensagem = "Carrinho existente atualizado com o novo conteúdo"
            }

            if (!carrinhoEmail && carrinhoCookie) {
                // caso o email não tenha carrinho, associar o email ao carrinho de cookie existente
                console.log("Criando carrinho com email")
                carrinho = await modelCarrinho.carrinho.findOneAndUpdate(
                    {cookieCliente: cookie},
                    req.body
                )
                mensagem = "Email associado ao carrinho existente."
            }
            
            console.log(mensagem)
            res.status(200).json({
                message: mensagem,
                carrinhoAntigo: carrinho,
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


    // @route DELETE /carrinhos/removerTodos
    static async removerTodosOsCarrinhos(req: Request, res: Response, next: NextFunction) {
        try {
            await modelCarrinho.carrinho.deleteMany()
            res.status(200).json({
                message: "Todos os carrinhos foram removidos."
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