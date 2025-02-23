import IProduto from "./produto";

export default interface IPedidoEnviado {
    produtos: Array<IProduto>,
    emailCliente: string
}