import mongoose from "mongoose"
import "./validadorGlobalMongoose.js"

const pedidoSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        produtos: {
            type: mongoose.Schema.Types.Array,
            required: [true, "Array de produtos obrigatório para cadastrar um pedido"],
            validate: {
                validator: function () {
                    return this.produtos.length >= 1
                },
                message: "Pedido precisa de pelo menos 1 produto",
            }
        },
        emailCliente: {
            type: mongoose.Schema.Types.String,
            trim: true,
            lowercase: true,
            required: [true, "Email é obrigatório para cadastrar um pedido"],
            validate: {
                validator: function(valor) {
                    // eslint-disable-next-line no-useless-escape
                    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(valor)
                },
                message: "Email fornecido '{VALUE}' é inválido",
                // eslint-disable-next-line no-useless-escape
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Preencha um email válido']
            }
        },
    },
    { versionKey: false }
)

const pedido = mongoose.model("pedidos", pedidoSchema)

export default pedido

// cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes', required: true }, // referencial para cliente
// cliente: {type: modelCliente.clienteSchema, required: true},
        