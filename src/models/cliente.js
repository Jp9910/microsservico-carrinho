import mongoose from "mongoose"
import modelCarrinho from "./carrinho.js"

const clienteSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        email: { type: mongoose.Schema.Types.String, required: [true, "O email é obrigatório"] },
        carrinho: modelCarrinho.carrinhoSchema, //embedded
        testeEnum: {type:String, enum: {values: ["TESTE", "ENUM2"], message: "Valor do testeEnum {VALUE} está inválido"}}
    },
    { versionKey: false }
)

const cliente = mongoose.model("clientes", clienteSchema)

export default cliente
