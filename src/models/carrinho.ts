import mongoose from "mongoose"
import "./validadorGlobalMongoose"
import ICarrinho from "../types/carrinho"

// https://mongoosejs.com/docs/typescript/schemas.html

const carrinhoSchema = new mongoose.Schema<ICarrinho>(
    {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "id" },
        produtos: {type: []},
        cookieCliente: {
            type: mongoose.Schema.Types.String,
            required: [
                function () {
                    console.log("email: "+this.emailCliente)
                    console.log("!this.emailCliente: "+!this.emailCliente)
                    return !this.emailCliente
                },
                "Cookie do cliente obrigatório caso não tenha email",
            ],
        },
        emailCliente: {
            type: mongoose.Schema.Types.String,
            trim: true,
            lowercase: true,
            required: [
                function () {
                    console.log("cookie: "+this.cookieCliente)
                    console.log("!this.cookieCliente: "+!this.cookieCliente)
                    return !this.cookieCliente
                },
                "Email obrigatório caso não tenha cookie do cliente",
            ],
            validate: {
                validator: function(valor) {
                    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(valor)
                },
                message: "Email fornecido '{VALUE}' é inválido"
            }
        },
    },
    { versionKey: false }
)

const carrinho = mongoose.model<ICarrinho>("carrinhos", carrinhoSchema)

export default { carrinho, carrinhoSchema }

// cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes', required: true }, // referencial para cliente
// cliente: {type: modelCliente.clienteSchema, required: true},

/*
 *
import mongoose from "mongoose"
import "./validadorGlobalMongoose"
import ICarrinho from "../types/carrinho"
import IProduto from "../types/produto"

// https://mongoosejs.com/docs/typescript/schemas.html
type CarrinhoHydratedDocument = mongoose.HydratedDocument<
  ICarrinho,
  { produtos: mongoose.HydratedArraySubdocument<ICarrinho> }
>;

type CarrinhoModelType = mongoose.Model<
  ICarrinho,
  {},
  {},
  {},
  CarrinhoHydratedDocument // THydratedDocumentType
>;

const carrinhoSchema = new mongoose.Schema<
    ICarrinho,
    CarrinhoModelType,
    {},
    {},
    {},
    {},
    mongoose.DefaultSchemaOptions, // schema options
    ICarrinho, // doctype
    CarrinhoHydratedDocument // THydratedDocumentType
    >(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        produtos: [{ nome: {type: String} }],
        cookieCliente: {
            type: mongoose.Schema.Types.String,
            required: [
                function () {
                    return !this.emailCliente
                },
                "Cookie do cliente obrigatório caso não tenha email",
            ],
        },
        emailCliente: {
            type: mongoose.Schema.Types.String,
            trim: true,
            lowercase: true,
            required: [
                function () {
                    return !this.cookieCliente
                },
                "Email obrigatório caso não tenha cookie do cliente",
            ],
            validate: {
                validator: function(valor) {
                    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(valor)
                },
                message: "Email fornecido '{VALUE}' é inválido",
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Preencha um email válido']
            }
        },
    },
    { versionKey: false }
)

const carrinho = mongoose.model("carrinhos", carrinhoSchema)

export default { carrinho, carrinhoSchema }

 *
 */