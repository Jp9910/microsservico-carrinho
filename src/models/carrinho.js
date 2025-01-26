import mongoose from "mongoose";

const carrinhoSchema = new mongoose.Schema ({
    id: { type: mongoose.Schema.Types.ObjectId },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'cliente', required: true },
    qnt_produtos: { type: mongoose.Schema.Types.Int32, required: true },
    produtos: { type: mongoose.Schema.Types.Array, required: true }
}, { versionKey: false })

const carrinho = mongoose.model("carrinhos", carrinhoSchema)

export default carrinho