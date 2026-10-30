
# CinePass — Sistema de Bilheteria de Cinema

Sistema web de bilheteria de cinema desenvolvido como projeto acadêmico, permitindo consultar filmes e sessões, selecionar assentos, realizar reservas, confirmar compras e validar ingressos.

## Funcionalidades

- Cadastro e login de usuários.
- Controle de acesso por perfil: CLIENTE, OPERADOR e ADMINISTRADOR.
- Listagem e gerenciamento de filmes.
- Cadastro e consulta de salas e sessões.
- Mapa de assentos com estados livre, reservado e vendido.
- Reserva temporária de assentos por 10 minutos.
- Confirmação de compra e emissão de ingressos com códigos únicos.
- Consulta e validação de ingressos.
- Relatórios de ocupação e vendas por sessão.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- bcrypt para proteção de senhas

### Frontend
- React Native
- Expo
- TypeScript

## Estrutura do projeto

```text
CinePass/
├── cineticket-backend/
│   ├── prisma/
│   ├── src/
│   ├── docs/
│   │   └── API.md
│   └── README.md
│
└── cineticket-frontend/
    ├── App.tsx
    └── ...
```

## Como executar o backend

### 1. Entrar na pasta

```bash
cd cineticket-backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o banco de dados

Criar o arquivo `.env` com a variável `DATABASE_URL` apontando para o PostgreSQL e configurar as demais variáveis exigidas pelo projeto.

Não publicar credenciais ou chaves secretas no GitHub.

### 4. Gerar o Prisma Client

```bash
npx prisma generate --config prisma.config.ts
```

### 5. Executar as migrações

```bash
npx prisma migrate deploy --config prisma.config.ts
```

### 6. Iniciar o servidor

```bash
npm run dev
```

A API estará disponível em:

`http://localhost:3333`

## Como executar o frontend

Entrar na pasta `cineticket-frontend`, instalar as dependências e iniciar o Expo:

```bash
npm install
npx expo start
```

Para executar no navegador:

```bash
npx expo start --web
```

## Documentação da API

A documentação dos endpoints, métodos HTTP, autenticação e regras de negócio está disponível em:

[`docs/API.md`](docs/API.md)

## Banco de dados

O projeto utiliza PostgreSQL e Prisma ORM para o mapeamento das entidades e gerenciamento das migrações.

O modelo contempla usuários, filmes, salas, assentos, sessões, reservas, assentos reservados e ingressos.

Também são utilizadas regras no banco de dados, índices e operações transacionais para manter a consistência das reservas e compras.

## Segurança e regras de negócio

- Senhas armazenadas com hash.
- Autenticação com JWT.
- Controle de acesso por perfil.
- Impedimento de reservas duplicadas.
- Expiração de reservas após 10 minutos.
- Ingressos com códigos únicos.
- Validação de ingresso com impedimento de reutilização.

## Projeto acadêmico

Desenvolvido para fins acadêmicos no curso de Sistemas de Informação e Engenharia de Computação — UNOESC, Campus Chapecó.
