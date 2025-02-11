import app from "./app"

// When you have "type": "module" in the package.json file, your source code should use import syntax. When you do not have, you should use require syntax; that is, adding "type": "module" to the package.json enables ES 6 modules
// https://stackoverflow.com/questions/61401475/why-is-type-module-in-package-json-file
// https://www.alura.com.br/artigos/guia-importacao-exportacao-modulos-javascript

const PORT = 3000

app.listen(PORT, () => {
    console.log("Servidor escutando")
})
