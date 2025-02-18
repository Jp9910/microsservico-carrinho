import { Types } from "mongoose";
import IProduto from "./produto";

export default interface IPedido {
    id: Types.ObjectId,
    produtos: Array<IProduto>,
    emailCliente: string
}