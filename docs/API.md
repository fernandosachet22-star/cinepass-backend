# CinePass — Documentação da API

## 1. Visão geral

A API CinePass gerencia um sistema de bilheteria de cinema, permitindo consultar filmes e sessões, reservar assentos, realizar compras, emitir ingressos e validar entradas.

**Tecnologias:** Node.js, Express, TypeScript, Prisma ORM e PostgreSQL.

**Endereço de produção:** `https://cinepass-backend-q1y2.onrender.com`

**Endereço local:** `http://localhost:3333`

As requisições e respostas utilizam JSON.

## 2. Autenticação

A autenticação é realizada por meio de token JWT.

Após o login, o token deve ser enviado nas rotas protegidas:

`Authorization: Bearer TOKEN`

O token possui validade de 8 horas.

### Perfis de acesso

- **CLIENTE:** consulta filmes e sessões, reserva assentos, realiza compras e consulta seus ingressos.
- **OPERADOR:** realiza vendas presenciais, valida ingressos e consulta relatórios.
- **ADMINISTRADOR:** possui acesso administrativo, gerenciamento de usuários e operações de operador.

## 3. Rotas de usuários

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| POST | `/usuarios/cadastro` | Pública | Cadastrar cliente |
| POST | `/usuarios/login` | Pública | Realizar login |
| POST | `/usuarios/admin/setup` | Chave de configuração | Criar primeiro administrador |
| GET | `/usuarios/perfil` | Autenticado | Consultar próprio perfil |
| POST | `/usuarios/senha` | Autenticado | Alterar senha |
| GET | `/usuarios` | ADMINISTRADOR | Listar usuários |
| POST | `/usuarios/gerenciar` | ADMINISTRADOR | Criar usuário gerenciado |

### Cadastro

`POST /usuarios/cadastro`

```json
{
  "nome": "Cliente Teste",
  "email": "cliente@cinepass.com",
  "senha": "Senha123"
}
```

### Login

`POST /usuarios/login`

```json
{
  "email": "cliente@cinepass.com",
  "senha": "Senha123"
}
```

O login retorna os dados públicos do usuário e o token de autenticação.

### Criação do primeiro administrador

`POST /usuarios/admin/setup`

Recebe `nome`, `email` e `senha` no corpo da requisição. A chave de configuração deve ser enviada no cabeçalho `x-admin-setup-key`.

Essa operação permite criar somente o primeiro administrador.

### Criação de usuário gerenciado

`POST /usuarios/gerenciar`

```json
{
  "nome": "Operador Teste",
  "email": "operador@cinepass.com",
  "senha": "Senha123",
  "perfil": "OPERADOR"
}
```

### Alteração de senha

`POST /usuarios/senha`

```json
{
  "senhaAtual": "Senha123",
  "novaSenha": "NovaSenha123"
}
```

## 4. Rotas de filmes

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| GET | `/filmes` | Pública | Listar filmes |
| POST | `/filmes` | OPERADOR ou ADMINISTRADOR | Cadastrar filme |
| PUT | `/filmes/:id` | OPERADOR ou ADMINISTRADOR | Atualizar filme |
| DELETE | `/filmes/:id` | OPERADOR ou ADMINISTRADOR | Excluir filme |

### Cadastro e atualização

```json
{
  "titulo": "Interestelar",
  "descricao": "Uma equipe explora possibilidades de sobrevivência da humanidade.",
  "duracao": 169,
  "classificacao": "10 anos",
  "genero": "Ficção científica",
  "imagem": "URL_DA_IMAGEM"
}
```

## 5. Rotas de salas

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| GET | `/salas` | Pública | Listar salas |
| GET | `/salas/:id` | Pública | Consultar sala |
| POST | `/salas` | OPERADOR ou ADMINISTRADOR | Cadastrar sala |

### Cadastro de sala

```json
{
  "nome": "Sala 1",
  "fileiras": 5,
  "assentosPorFileira": 8
}
```

Os assentos são gerados automaticamente, com códigos como A1, A2, B1 e B2.

## 6. Rotas de sessões

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| GET | `/sessoes` | Pública | Listar sessões |
| GET | `/sessoes/filme/:filmeId` | Pública | Listar sessões de um filme |
| GET | `/sessoes/:sessaoId/assentos` | Pública | Consultar mapa de assentos |
| POST | `/sessoes` | OPERADOR ou ADMINISTRADOR | Cadastrar sessão |

### Cadastro de sessão

```json
{
  "filmeId": 1,
  "salaId": 1,
  "dataHora": "2026-11-25T19:30:00",
  "preco": 30.00
}
```

## 7. Rotas de reservas

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| POST | `/reservas` | CLIENTE autenticado | Criar reserva |
| POST | `/reservas/balcao` | OPERADOR ou ADMINISTRADOR | Criar reserva para venda presencial |

### Criar reserva

`POST /reservas`

### Criar reserva para venda presencial

`POST /reservas/balcao`

Ambas recebem o seguinte corpo:

```json
{
  "sessaoId": 1,
  "assentosIds": [1, 2]
}
```

A reserva mantém os assentos bloqueados por 10 minutos para que a compra seja concluída.

O sistema verifica a disponibilidade dos assentos e sua correspondência com a sala da sessão.

## 8. Rotas de compras

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| POST | `/compras/:reservaId/confirmar` | Usuário autenticado | Confirmar compra |
| POST | `/compras/balcao/:reservaId/confirmar` | OPERADOR ou ADMINISTRADOR | Confirmar venda presencial |

As rotas recebem o identificador da reserva pela URL e não exigem corpo JSON.

A confirmação gera ingressos com códigos únicos. A compra é simulada para fins acadêmicos, sem integração com uma operadora de pagamentos.

## 9. Rotas de ingressos

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| GET | `/ingressos/meus` | Usuário autenticado | Consultar próprios ingressos |
| GET | `/ingressos/:codigo` | OPERADOR ou ADMINISTRADOR | Consultar ingresso pelo código |
| POST | `/ingressos/:codigo/validar` | OPERADOR ou ADMINISTRADOR | Validar entrada |

Cada ingresso pode ser utilizado somente uma vez. A validação registra a utilização do ingresso, impedindo uma segunda validação.

## 10. Rotas de relatórios

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| GET | `/relatorios` | OPERADOR ou ADMINISTRADOR | Consultar relatório de vendas e ocupação |

O relatório reúne informações de filmes, salas, sessões, reservas e ingressos, permitindo acompanhar as vendas e a ocupação das sessões.

## 11. Regras de negócio

- Não permite reservar assentos já reservados ou vendidos.
- Cada reserva possui prazo de 10 minutos.
- Reservas expiradas não podem ser confirmadas.
- Os assentos devem pertencer à sala da sessão selecionada.
- Uma reserva não pode ser confirmada por outro cliente.
- A compra confirmada gera ingressos com códigos únicos.
- Um ingresso não pode ser validado mais de uma vez.
- A venda presencial é restrita aos perfis OPERADOR e ADMINISTRADOR.
- As operações de compra utilizam transações para manter a consistência dos dados.
- As rotas administrativas exigem autenticação e autorização por perfil.

## 12. Códigos HTTP utilizados

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado |
| 400 | Dados inválidos ou regra de negócio não atendida |
| 401 | Não autenticado ou credenciais inválidas |
| 403 | Sem permissão |
| 404 | Registro não encontrado |
| 409 | Conflito ou operação não permitida |
| 500 | Erro interno do servidor |