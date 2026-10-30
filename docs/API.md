
# CinePass — Documentação da API

## 1. Visão geral

A API CinePass gerencia um sistema de bilheteria de cinema, permitindo consultar filmes e sessões, reservar assentos, realizar compras, emitir ingressos e validar entradas.

**Tecnologias:** Node.js, Express, TypeScript, Prisma ORM e PostgreSQL.

**Endereço local:** `http://localhost:3333`

## 2. Autenticação

A autenticação é realizada por meio de token JWT.

Após o login, a API retorna um token que deve ser enviado nas rotas protegidas:

`Authorization: Bearer TOKEN`

O token possui validade de 8 horas.

### Perfis de acesso

- CLIENTE: consulta filmes, sessões, reserva assentos e realiza compras.
- OPERADOR: valida ingressos e acessa relatórios.
- ADMINISTRADOR: possui acesso administrativo e gerenciamento de usuários.

## 3. Rotas de usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | /usuarios/cadastro | Cadastrar cliente |
| POST | /usuarios/login | Realizar login |
| POST | /usuarios/admin/setup | Criar primeiro administrador |
| GET | /usuarios/perfil | Consultar perfil autenticado |
| POST | /usuarios/senha | Alterar senha |
| GET | /usuarios | Listar usuários (ADMINISTRADOR) |
| POST | /usuarios/gerenciar | Criar usuário gerenciado (ADMINISTRADOR) |

### Cadastro

`POST /usuarios/cadastro`

Corpo da requisição:

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

Retorna os dados públicos do usuário e o token de autenticação.

## 4. Rotas de filmes

| Método | Rota | Descrição |
|---|---|---|
| GET | /filmes | Listar filmes |
| POST | /filmes | Cadastrar filme |
| DELETE | /filmes/:id | Excluir filme |

Corpo para cadastro:

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

| Método | Rota | Descrição |
|---|---|---|
| GET | /salas | Listar salas |
| GET | /salas/:id | Consultar sala |
| POST | /salas | Cadastrar sala |

## 6. Rotas de sessões

| Método | Rota | Descrição |
|---|---|---|
| GET | /sessoes | Listar sessões |
| GET | /sessoes/filme/:filmeId | Listar sessões de um filme |
| GET | /sessoes/:sessaoId/assentos | Consultar mapa de assentos |
| POST | /sessoes | Cadastrar sessão |

## 7. Rotas de reservas

| Método | Rota | Descrição |
|---|---|---|
| POST | /reservas | Criar reserva |

Exemplo de requisição:

```json
{
  "sessaoId": 1,
  "assentosIds": [1, 2]
}
```

A reserva mantém os assentos bloqueados por 10 minutos para que o cliente conclua a compra.

Reservas expiradas deixam de bloquear os assentos quando a disponibilidade é consultada ou quando a compra é validada.

## 8. Rotas de compras

| Método | Rota | Descrição |
|---|---|---|
| POST | /compras/:reservaId/confirmar | Confirmar compra e emitir ingressos |

A confirmação gera ingressos com códigos únicos.

## 9. Rotas de ingressos

| Método | Rota | Descrição |
|---|---|---|
| GET | /ingressos/:codigo | Consultar ingresso |
| POST | /ingressos/:codigo/validar | Validar entrada |

Cada ingresso pode ser utilizado somente uma vez.

## 10. Rotas de relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | /relatorios | Consultar relatório de sessões |

O acesso é permitido aos perfis OPERADOR e ADMINISTRADOR.

O relatório apresenta informações de filmes, salas, sessões, reservas e ingressos.

## 11. Regras de negócio

- Não permite reservar assentos já reservados ou vendidos.
- Cada reserva possui prazo de 10 minutos.
- Reservas expiradas liberam os assentos.
- A compra confirmada gera ingressos com códigos únicos.
- Um ingresso não pode ser validado mais de uma vez.
- As rotas administrativas exigem autenticação e autorização por perfil.

## 12. Códigos HTTP utilizados

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Registro não encontrado |
| 409 | Conflito ou operação não permitida |
| 500 | Erro interno do servidor |
