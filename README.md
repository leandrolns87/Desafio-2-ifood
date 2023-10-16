# Desafio-API-para-um-Banco-Digital
Este projeto é uma API REST para um Banco Digital que permite a criação de contas bancárias, realização de transações, consulta de saldo e emissão de extratos.

## Executando o Projeto
Para executar este projeto, siga as etapas abaixo:
-Clone o repositório para o seu computador:
git clone https://github.com/seu-usuario/Desafio-API-para-um-Banco-Digital.git

-Instale as dependências necessárias:
npm install express

-Inicie o servidor:
npm run dev

O servidor estará rodando em http://localhost:3000.

### Endpoints
A API possui os seguintes endpoints:

#### Listar Contas Bancárias
Endpoint: GET /contas?senha_banco=<senha_banco>

Este endpoint lista todas as contas bancárias existentes.

Exemplo de Requisição:
GET http://localhost:3000/contas?senha_banco=Cubos123Bank

Exemplo de Resposta:
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Foo Bar",
            "cpf": "00011122233",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar.com",
            "senha": "1234"
        }
    },
    {
        "numero": "2",
        "saldo": 1000,
        "usuario": {
            "nome": "Foo Bar 2",
            "cpf": "00011122234",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar2.com",
            "senha": "12345"
        }
    }
]

#### Criar Conta Bancária
Endpoint: POST /contas

Este endpoint cria uma nova conta bancária.

Exemplo de Requisição:
POST http://localhost:3000/contas
{
    "nome": "Novo Cliente",
    "cpf": "12345678900",
    "data_nascimento": "1990-01-01",
    "telefone": "71999999999",
    "email": "contato@cliente.com",
    "senha": "123456"
}

#### Atualizar Usuário da Conta Bancária
Endpoint: PUT /contas/:numeroConta/usuario

Este endpoint atualiza os dados do usuário de uma conta bancária.

Exemplo de Requisição:
PUT http://localhost:3000/contas/1/usuario
{
    "nome": "Novo Nome",
    "cpf": "12345678900",
    "data_nascimento": "1990-01-01",
    "telefone": "71999999999",
    "email": "contato@cliente.com",
    "senha": "123456"
}
