const bancodedados = require("../bancodedados")
let numeroFinal = 1

// Rota para listar uma conta bancária
const listarContas = (req, res ) => {
    const { senha_banco } = req.query

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(403).json({ mensagem: "Senha não confere" })
    }

    res.status(200).json(bancodedados.contas)
}

// Rota para criar uma conta bancária
const criarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os dados!" })
    }

    const numcpf = bancodedados.contas.find((conta) => conta.usuario.cpf == cpf) 
        if (numcpf) {
            return res.status(403).json({ mensagem: "CPF já está em uso! Utilize outro CPF"})        
    }

    const unicoemail = bancodedados.contas.find((conta) => conta.usuario.email == email) 
    if (unicoemail) {
        return res.status(403).json({ mensagem: "E-mail já está em uso! Utilize outro e-mail"})        
    }

// Cria a conta com saldo inicial zero
    const novaConta = {
        numero: numeroFinal++, 
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    bancodedados.contas.push(novaConta);

    res.status(201).json({ mensagem: 'Conta criada com sucesso' });
}

// Rota para atualizar os dados do usuário de uma conta bancária
const atualizarContas = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    // Verifica se a conta com o número informado existe
    const contaExistente = bancodedados.contas.find((conta) => conta.numero === Number(numeroConta));

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    // Verifica se todos os campos obrigatórios foram informados
    if (!nome || !data_nascimento || !telefone || !senha || !cpf || !email) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados' });
    }

    // Verifica se o CPF ou e-mail já estão cadastrados em outra conta
    if (bancodedados.contas.some((conta) => conta.cpf === cpf)) {
        return res.status(400).json({ mensagem: 'O CPF informado já existe cadastrado em outra conta!' });
    }

    if (bancodedados.contas.some((conta) => conta.email === email)) {
        return res.status(400).json({ mensagem: 'O e-mail informado já existe cadastrado em outra conta!' });
    }

    // Atualiza os dados do usuário na conta existente
    contaExistente.usuario.nome = nome
    contaExistente.usuario.cpf = cpf
    contaExistente.usuario.data_nascimento = data_nascimento
    contaExistente.usuario.telefone = telefone
    contaExistente.usuario.email = email
    contaExistente.usuario.senha = senha

    // Resposta de sucesso (status 200 - OK)
    return res.status(200).json({ mensagem: 'Dados do usuário atualizados com sucesso' })
}

// Rota para excluir uma conta bancária
const deletarContas = (req, res) => {
    const numeroConta = req.params.numeroConta;

    // Verifica se a conta com o número informado existe
    const contaExistente = bancodedados.contas.find((conta) => conta.numeroConta === numeroConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    // Verifica se o saldo da conta é zero
    if (contaExistente.saldo !== 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero' });
    }

    // Remove a conta do objeto de persistência de dados
    const index = bancodedados.contas.indexOf(contaExistente);
    bancodedados.contas.splice(index, 1);

    res.status(204).send();
}  

// Rota para efetuar um depósito em uma conta bancária
const movimentacaoDeposito = (req, res) => {
    const { numero_conta, valor } = req.body;

    // Verifica se o número da conta e o valor do depósito foram informados
    if (!numero_conta || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor do depósito são obrigatórios e devem ser maiores que zero.' });
    }

    // Verifica se a conta bancária informada existe
    const contaExistente = bancodedados.contas.find((conta) => conta.numeroConta === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    // Realiza o depósito e atualiza o saldo da conta
    contaExistente.saldo += valor;

    // Registra a transação de depósito
    const data = new Date().toISOString();
    transacoes.push({ data, numero_conta, valor });

    res.status(204).send();
};

// Rota para efetuar um saque em uma conta bancária
const movimentacaoSaque = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    // Verifica se o número da conta, o valor do saque e a senha foram informados
    if (!numero_conta || valor === undefined || valor < 0 || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, o valor do saque e a senha são obrigatórios e o valor não pode ser menor que zero.' });
    }

    // Verifica se a conta bancária informada existe
    const contaExistente = bancodedados.contas.find((conta) => conta.numeroConta === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    // Verifica se a senha informada é válida para a conta
    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Verifica se há saldo disponível para saque
    if (contaExistente.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar o saque' });
    }

    // Realiza o saque e atualiza o saldo da conta
    contaExistente.saldo -= valor;

    // Registra a transação de saque
    const data = new Date().toISOString();
    transacoes.push({ data, numero_conta, valor: -valor });

    res.status(204).send();
};

// Rota para efetuar uma transferência entre contas bancárias
const movimentacaoTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    // Verifica se todos os campos obrigatórios foram informados
    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || valor <= 0 || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados corretamente.' });
    }

    // Verifica se a conta de origem e a conta de destino existem
    const contaOrigem = bancodedados.contas.find((conta) => conta.numeroConta === numero_conta_origem);
    const contaDestino = bancodedados.contas.find((conta) => conta.numeroConta === numero_conta_destino);

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'Conta de origem ou conta de destino não encontrada' });
    }

    // Verifica se a senha informada é válida para a conta de origem
    if (contaOrigem.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Verifica se há saldo disponível na conta de origem para a transferência
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    }

    // Realiza a transferência e atualiza os saldos das contas
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    // Registra a transação de transferência
    const data = new Date().toISOString();
    transacoes.push({ data, numero_conta_origem, numero_conta_destino, valor });

    // Resposta de sucesso (status 204 - No Content)
    res.status(204).send();
};

// Rota para verificar o saldo de uma conta bancária
const movimentacaoSaldo = (req, res) => {
    const numeroConta = req.query.numero_conta;
    const senha = req.query.senha;

    // Verifica se o número da conta e a senha foram informados
    if (!numeroConta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e a senha são obrigatórios.' });
    }

    // Verifica se a conta bancária informada existe
    const contaExistente = bancodedados.contas.find((conta) => conta.numeroConta === numeroConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    // Verifica se a senha informada é válida para a conta
    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Resposta de sucesso (status 200) com o saldo da conta
    res.status(200).json({ saldo: contaExistente.saldo });
};

// Rota para obter o extrato de uma conta bancária
const movimentacaoExtrato = (req, res) => {
    const numeroConta = req.query.numero_conta;
    const senha = req.query.senha;

    // Verifica se o número da conta e a senha foram informados
    if (!numeroConta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e a senha são obrigatórios.' });
    }

    // Verifica se a conta bancária informada existe
    const contaExistente = contas.find((conta) => conta.numeroConta === numeroConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    // Verifica se a senha informada é válida para a conta
    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Filtra as transações relacionadas à conta em questão
    const extrato = {
        depositos: transacoes.filter((t) => t.numero_conta === numeroConta && t.valor > 0),
        saques: transacoes.filter((t) => t.numero_conta === numeroConta && t.valor < 0),
        transferenciasEnviadas: transacoes.filter((t) => t.numero_conta_origem === numeroConta),
        transferenciasRecebidas: transacoes.filter((t) => t.numero_conta_destino === numeroConta),
    };

    // Resposta de sucesso (status 200) com o extrato da conta
    res.status(200).json(extrato);
};

module.exports = {
    listarContas,
    criarContas,
    atualizarContas,
    deletarContas,
    movimentacaoDeposito,
    movimentacaoSaque,
    movimentacaoTransferencia,
    movimentacaoSaldo,
    movimentacaoExtrato,
}