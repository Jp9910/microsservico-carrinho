import cliente from "../models/cliente.js"
import ErroBadRequest from "../erros/ErroBadRequest"
import { NextFunction, Request, Response } from "express"
import { Document, Types } from "mongoose"

// CLIENTE não está sendo usado no sistema, mas vou deixar aqui pq tem algumas funções
// interessantes implementadas que talvez possam ser aproveitadas depois em outro controller
class ClienteController {
    // @route GET /clientes
    static async listarClientes(req: Request, res: Response, next: NextFunction) {
        try {
            // essa paginação pode ser feita em forma de middleware para reaproveitar o código em outras rotas, passando
            // a informação da query no objeto request (req)
            // let { limite = 5, pagina = 1, ordenarPor = "_id", ordem = -1 } = req.query // queries para paginação

            const limite = parseInt(req.query.limite as string)
            const pagina = parseInt(req.query.pagina as string)
            // const ordem = parseInt(req.query.ordem as string)
            const ordenarPor = req.query.ordenarPor as string

            if (pagina < 1 || limite < 1) {
                throw new ErroBadRequest()
            }
            const listaClientes = await cliente
                .find() // pegar todos os documentos
                .sort({[ordenarPor] : -1}) // colocar a variavel entre [] permite usa-la como variável pra nomear a propriedade do objeto
                .skip((pagina - 1) * limite) // pular certa quantidade de documentos de acordo com a paginação
                .limit(limite) // pegar apenas X quantidade de documentos
            res.status(200).json(listaClientes)
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /clientes/busca
    static async listarClientesPorBusca(req: Request, res: Response, next: NextFunction) {
        //Operadores do mongoose: https://www.mongodb.com/docs/manual/reference/operator/query/
        try {
            const busca = {
                email: { $regex: req.query.email, $options: "i" },
            }
            const clientesResultado = await cliente.find(busca)
            res.status(200).send(clientesResultado)
        } catch (erro) {
            next(erro)
        }
    }

    // @route POST /clientes
    static async cadastrarCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const novoCliente = await cliente.create(req.body)
            res.status(201).json({
                message: "Cliente criado com sucesso.",
                cliente: novoCliente,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route GET /clientes/:id
    static async listarClientePorId(req: Request, res: Response, next: NextFunction) {
        try {
            const clienteEncontrado = await cliente.findById(req.params.id)
            res.status(200).json(clienteEncontrado)
        } catch (erro) {
            next(erro)
        }
    }

    // @route PUT /clientes/:id
    static async atualizarCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const clienteAtualizado = await cliente.findByIdAndUpdate(
                req.params.id,
                req.body
            )
            res.status(200).json({
                message: "Cliente atualizado com sucesso.",
                cliente: clienteAtualizado,
            })
        } catch (erro) {
            next(erro)
        }
    }

    // @route DELETE /clientes/:id
    static async removerCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const clienteRemovido = await cliente.findByIdAndDelete(
                req.params.id
            )
            res.status(200).json({
                message: "Cliente removido com sucesso.",
                cliente: clienteRemovido,
            })
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarCarrinhoDoClientePorEmail(emailCliente:string, carrinho: Document) {
        const clienteDoCarrinho = await this.getClientePorEmail(emailCliente)
        // Juntar os dados do carrinho ao cliente
        const clienteMaisCarrinho = {
            ...clienteDoCarrinho?.toJSON(), // O banco retorna também o id do objeto, que não é necessário. As informações necessarias estão na variavel _doc
            carrinho: { ...carrinho },
        }
        await cliente.findByIdAndUpdate(
            clienteDoCarrinho?._id,
            clienteMaisCarrinho
        )
    }

    static async atualizarCarrinhoDoClientePorId(idCliente: Types.ObjectId, carrinho: Document) {
        // console.log(idCliente)
        const clienteDoCarrinho = await cliente.findById(idCliente)
        // Juntar os dados do carrinho ao cliente
        const clienteMaisCarrinho = {
            ...clienteDoCarrinho?.toJSON(),
            carrinho: { ...carrinho },
        }
        await cliente.findByIdAndUpdate(
            clienteDoCarrinho?._id,
            clienteMaisCarrinho
        )
    }

    static async getClientePorEmail(email: string) {
        try {
            const clienteEncontrado = await cliente.findOne({ email: email })
            return clienteEncontrado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (erro: any) {
            console.log(erro.message)
        }
    }

    static async getClientePorIdDoCarrinho(idCarrinho: string) {
        try {
            const clienteEncontrado = await cliente.findOne({
                "carrinho._id": idCarrinho,
            })
            return clienteEncontrado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (erro: any) {
            console.log(erro.message)
        }
    }
}

export default ClienteController
