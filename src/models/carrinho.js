import mongoose from "mongoose"

const carrinhoSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        idCliente: { type: mongoose.Schema.Types.String },
        produtos: { type: mongoose.Schema.Types.Array },
    },
    { versionKey: false }
)

const carrinho = mongoose.model("carrinhos", carrinhoSchema)

export default { carrinho, carrinhoSchema }

// cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes', required: true }, // referencial para cliente
// cliente: {type: modelCliente.clienteSchema, required: true},
