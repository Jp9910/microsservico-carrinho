import mongoose from "mongoose"

const carrinhoSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        produtos: { type: mongoose.Schema.Types.Array },
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
                    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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

// cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'clientes', required: true }, // referencial para cliente
// cliente: {type: modelCliente.clienteSchema, required: true},
