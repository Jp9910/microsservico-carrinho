import mongoose from "mongoose"
import modelCarrinho from "./carrinho.js"

const clienteSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        cpf: { type: mongoose.Schema.Types.String, required: true },
        carrinho: modelCarrinho.carrinhoSchema,
    },
    { versionKey: false }
)

const cliente = mongoose.model("clientes", clienteSchema)

export default cliente
