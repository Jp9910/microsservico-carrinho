import mongoose from "mongoose"
import "./validadorGlobalMongoose"
import IPedido from "../types/pedido";

const pedidoSchema = new mongoose.Schema<IPedido>(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        produtos: { // poderia simplesmente ser uma referência ao carrinho... mas parece errado
            type: [],
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
                    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(valor)
                },
                message: "Email fornecido '{VALUE}' é inválido"
            }
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const pedido = mongoose.model("pedidos", pedidoSchema)

export default pedido

// cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes', required: true }, // referencial para cliente
// cliente: {type: modelCliente.clienteSchema, required: true},
        