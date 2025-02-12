import mongoose from "mongoose"
import "dotenv/config"

const db_name = process.env.db_name
var connectionString = ""

if (process.env.db_location === "atlas") {
    const password = process.env.atlas_db_password
    const user = process.env.atlas_db_username
    connectionString = "".concat(
        "mongodb+srv://",
        user,
        ":",
        password,
        "@cluster0.y8dl2.mongodb.net/",
        db_name,
        "?retryWrites=true&w=majority&appName=Cluster0"
    )
}

if (process.env.db_location === "local") {
    const user = process.env.local_db_username
    const password = process.env.local_db_password
    const host = process.env.local_db_container_name
    const port = 27017
    connectionString = "".concat(
        "mongodb://",
        user,
        ":",
        password,
        "@",
        host,
        ":",
        port,
        "/",
        db_name,
        "?authSource=admin"
    )
    //mongodb://username:password@host:port/database?options
}

async function conectarBD() {
    // console.log(connectionString)
    mongoose.connect(connectionString)
    return mongoose.connection
}

export default conectarBD
