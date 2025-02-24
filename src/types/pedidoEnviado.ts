
export default interface IPedidoEnviado {
    // Prestar atenção no casing das palavras, pq no microsservico de loja as propriedades começam com maiusculo
    IdsProdutos: Array<number>, // array de ids dos produtos
    EmailCliente: string,
    IdCarrinho: string
}