import mongoose, {mongo} from "mongoose";
import 'dotenv/config'

const password = process.env.db_password
const user = process.env.db_username
const database = "microsservico-carrinho"
var connectionString = "".concat(
    "mongodb+srv://",
    user,
    ":",
    password, 
    "@cluster0.y8dl2.mongodb.net/",
    database,
    "?retryWrites=true&w=majority&appName=Cluster0"
)

async function conectarBD() {
    mongoose.connect(connectionString)
    return mongoose.connection
}

export default conectarBD