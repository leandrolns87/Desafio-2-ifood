const { Router } = require("express")
const rota = Router()
const { 
    listarContas, 
    criarContas,
    atualizarContas, 
    deletarContas, 
    movimentacaoDeposito, 
    movimentacaoSaque, 
    movimentacaoTransferencia, 
    movimentacaoSaldo, 
    movimentacaoExtrato 
    } = require ('./controladores/controllerContas')

rota.get('/contas', listarContas)
rota.post('/contas', criarContas)
rota.put('/contas/:numeroConta/usuario', atualizarContas)
rota.delete('/contas/:numeroConta', deletarContas)
rota.post('/transacoes/depositar', movimentacaoDeposito)
rota.post('/transacoes/sacar', movimentacaoSaque)
rota.post('/transacaoes/transferir', movimentacaoTransferencia)
rota.get('/conta/saldo', movimentacaoSaldo)
rota.get('/conta/extrato', movimentacaoExtrato)

module.exports = {rota}

