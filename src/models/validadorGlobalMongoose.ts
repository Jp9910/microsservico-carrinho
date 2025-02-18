import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
    validator: (valor:string) => valor.trim() !== "",
    message: (obj: any) => {return `O campo ${obj.path} está em branco`}
});