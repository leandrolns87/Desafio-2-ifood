const express = require('express')
const { rota } = require('./router')

const app = express()
const port = 3000

app.use(express.json())
app.use(rota)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`)
})