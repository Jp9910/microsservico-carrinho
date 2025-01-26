import carrinho from "../models/carrinho.js";

class CarrinhoController {
    static async listarCarrinhos(req, res) {
        const listaCarrinhos = await carrinho.find({});
        res.status(200).json(listaCarrinhos);
    }

    static async cadastrarCarrinho(req, res) {
        try {
            const novoCarrinho = await carrinho.create(req.body)
            res.status(201).json({ message: "Carrinho criado com sucesso.", carrinho: novoCarrinho})
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao cadastrar carrinho` });
        }
    }
};

export default CarrinhoController;