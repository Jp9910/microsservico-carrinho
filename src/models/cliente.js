import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema ({
    id: { type: mongoose.Schema.Types.ObjectId }
}, { versionKey: false })

const cliente = mongoose.model("clientes", clienteSchema)

export default cliente