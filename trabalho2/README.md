# Avatar Wiki — Backend (2º Trabalho de Programação IV)

API REST desenvolvida em **NestJS + TypeORM (better-sqlite3)** para dar suporte dinâmico ao front-end da Wiki de Avatar: A Lenda de Aang, criado no 1º trabalho. O projeto reaproveita a página de **Galeria** como entidade de conteúdo, adicionando persistência real em banco de dados, autenticação JWT e testes unitários.

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Executando o projeto](#executando-o-projeto)
- [Executando os testes](#executando-os-testes)
- [Documentação interativa (Swagger)](#documentação-interativa-swagger)
- [Autenticação](#autenticação)
- [Mapeamento dos endpoints](#mapeamento-dos-endpoints)
- [Modelo de dados](#modelo-de-dados)
- [Integração com o front-end](#integração-com-o-front-end)

## Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js/TypeScript
- [TypeORM](https://typeorm.io/) com driver `better-sqlite3` — persistência de dados
- [Passport](http://www.passportjs.org/) + [`@nestjs/jwt`](https://github.com/nestjs/jwt) — autenticação JWT
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — hash de senhas
- [class-validator](https://github.com/typestack/class-validator) — validação de DTOs
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) — testes unitários
- [Swagger (`@nestjs/swagger`)](https://docs.nestjs.com/openapi/introduction) — documentação interativa da API

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
# clone o repositório e entre na pasta do backend
cd trabalho2/backend

# instale as dependências
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz da pasta `backend/` com as seguintes variáveis:

```
JWT_SECRET=troque_isso_por_um_segredo_bem_forte
JWT_EXPIRES_IN=2h
```

O banco de dados SQLite é criado automaticamente (arquivo local, configurado em `src/ormconfig.ts`) na primeira execução — não é necessário nenhum setup adicional de banco.

## Executando o projeto

```bash
# modo desenvolvimento (watch mode, recompila a cada alteração)
npm run start:dev

# modo produção
npm run build
npm run start
```

Por padrão a API sobe em `http://localhost:3000`.

## Executando os testes

```bash
# roda toda a suíte de testes unitários
npm run test

# roda com relatório de cobertura
npm run test:cov
```

A suíte cobre as regras de negócio dos módulos `auth` e `galery` (services) e o comportamento dos controllers, incluindo:

- criação de usuário com senha hasheada
- bloqueio de e-mail duplicado no cadastro
- geração de token JWT no login
- rejeição de credenciais inválidas
- CRUD completo de itens de galeria (criação, listagem com filtro por categoria, busca por id, atualização, remoção)
- tratamento de erros (404 para item inexistente, 409 para usuário duplicado, 401 para credenciais/token inválidos)

## Documentação interativa (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3000/api
```

A página permite testar todos os endpoints diretamente pelo navegador. Para acessar rotas protegidas, faça login pelo endpoint `/auth/login`, copie o token retornado, clique em **Authorize** no topo da página e cole o token.

## Autenticação

O projeto usa **JWT (JSON Web Token)** para proteger as rotas de conteúdo. O fluxo é:

1. O usuário se cadastra em `POST /auth/register` (e-mail + senha).
2. O usuário faz login em `POST /auth/login`, recebendo um token JWT.
3. O token deve ser enviado no header `Authorization: Bearer <token>` em toda requisição às rotas protegidas (`/galery/*`).
4. Requisições sem token válido recebem `401 Unauthorized`.

As senhas nunca são armazenadas em texto puro — são hasheadas com bcrypt antes de serem persistidas.

## Mapeamento dos endpoints

### Autenticação (`/auth`) — rotas públicas

| Método | Rota            | Body                              | Descrição                          |
|--------|-----------------|------------------------------------|-------------------------------------|
| POST   | `/auth/register`| `{ "email": string, "password": string }` | Cria um novo usuário |
| POST   | `/auth/login`   | `{ "email": string, "password": string }` | Autentica e retorna `{ "token": string }` |

### Galeria (`/galery`) — rotas protegidas (exigem `Authorization: Bearer <token>`)

| Método | Rota            | Body / Query                                                                 | Descrição                                             |
|--------|-----------------|-------------------------------------------------------------------------------|--------------------------------------------------------|
| GET    | `/galery`       | Query opcional `?categoria=cenario\|batalha\|arte`                           | Lista os itens, ordenados pelo campo `ordem`           |
| GET    | `/galery/:id`   | —                                                                              | Retorna um item específico                              |
| POST   | `/galery`       | `{ "titulo", "conteudo", "imagem", "categoria", "ordem"? }`                    | Cria um novo item                                       |
| PATCH  | `/galery/:id`   | Qualquer subconjunto de `{ "titulo", "conteudo", "imagem", "categoria", "ordem" }` | Atualiza parcialmente um item                     |
| DELETE | `/galery/:id`   | —                                                                              | Remove um item                                           |

**Exemplo de criação (`POST /galery`):**
```json
{
  "titulo": "Ba Sing Se",
  "conteudo": "A capital do Reino da Terra",
  "imagem": "https://raw.githubusercontent.com/usuario/repo/main/assets/cenario-ba-sing-se.png",
  "categoria": "cenario",
  "ordem": 1
}
```

## Modelo de dados

### `Galery`

| Campo       | Tipo     | Descrição                                                        |
|-------------|----------|---------------------------------------------------------------------|
| `id`        | number   | Identificador único (auto-incremento)                               |
| `titulo`    | string   | Título/legenda do item                                               |
| `conteudo`  | string   | Descrição do item                                                    |
| `imagem`    | string   | URL da imagem                                                        |
| `categoria` | string   | `cenario`, `batalha` ou `arte` — usado para filtro na interface       |
| `ordem`     | number   | Define a ordem de exibição no front-end                              |
| `createdAt` | datetime | Data de criação (gerado automaticamente)                             |
| `updatedAt` | datetime | Data da última atualização (gerado automaticamente)                  |

### `User`

| Campo      | Tipo   | Descrição                          |
|------------|--------|--------------------------------------|
| `id`       | number | Identificador único                  |
| `email`    | string | E-mail (único)                        |
| `password` | string | Hash bcrypt da senha                  |

## Integração com o front-end

O front-end (`galeria.html` / `script.js`) não utiliza mais dados estáticos. Ao carregar a página:

1. O script realiza login automático com um usuário fixo (`garantirLogin()`), armazenando o token JWT no `localStorage`.
2. A galeria é buscada via `fetch` em `GET /galery` (com filtro opcional por categoria através dos botões de filtro).
3. Os itens retornados pela API são renderizados dinamicamente no DOM.

É necessário que o backend esteja rodando em `http://localhost:3000` com CORS habilitado (`app.enableCors()` em `src/main.ts`) para que o front, servido por outra origem (ex: Live Server em `http://127.0.0.1:5500`), consiga se comunicar com a API.