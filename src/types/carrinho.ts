import { Types } from "mongoose";
import IProduto from "./produto";

export default interface ICarrinho {
    id: Types.ObjectId,
    produtos: Array<IProduto>,
    emailCliente: string,
    cookieCliente: string
}