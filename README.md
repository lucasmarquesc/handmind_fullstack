# 🧠 HandMind - API CRUD

API back-end evoluída para o projeto **HandMind**, implementando um CRUD completo para gerenciar módulos de aprendizado.  
A API utiliza **Node.js**, **TypeScript**, **Express**, **Prisma** (com banco **PostgreSQL**) e **Zod** para validação em tempo de execução.

---

## 🚀 Tecnologias

- Node.js (v18+)
- TypeScript
- Express
- Prisma ORM
- PostgreSQL (via Docker)
- Zod (validação de schemas)
- Docker & Docker Compose

---

## ⚙️ Pré-requisitos

Antes de iniciar, garanta que você tenha instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## 🧩 1. Instalação e Configuração

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone <URL_DO_SEU_REPOSITORIO>

# Entre na pasta do projeto
cd handmind_backend

# Instale as dependências
npm install
```

Crie o arquivo de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

O arquivo `.env` deve conter as variáveis:

```env
# URL de conexão com o banco de dados PostgreSQL no Docker
DATABASE_URL="postgresql://admin:senha123@localhost:5432/handmind_db"

# Origem permitida para requisições CORS
ALLOWED_ORIGIN="http://localhost:5173"
```

---

## 🐳 2. Execução (Passo a Passo)

### 🔹 Passo 1: Iniciar o Banco de Dados (Docker)

Suba o container PostgreSQL:

```bash
docker-compose up -d
```

Isso criará e iniciará o banco de dados `handmind_db` em segundo plano.

---

### 🔹 Passo 2: Migrar e Popular o Banco (Prisma)

Execute as migrations e o seed:

```bash
# Cria as tabelas no banco
npx prisma migrate dev

# Popula o banco com dados iniciais (mínimo 5 itens)
npm run seed
```

---

### 🔹 Passo 3: Rodar o Servidor

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3001
```

---

## 🧪 3. Testando com o Insomnia

Após o servidor estar rodando, use o [Insomnia](https://insomnia.rest/) para testar os endpoints.

### 🔍 Cenários de Teste Recomendados

| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| **GET** | `/api/modules` | Lista todos os módulos |
| **GET** | `/api/modules/:id` | Busca módulo por ID (válido e inválido) |
| **POST** | `/api/modules` | Cria módulo (payload válido e inválido) |
| **PUT** | `/api/modules/:id` | Atualiza módulo existente ou tenta atualizar inexistente |
| **DELETE** | `/api/modules/:id` | Remove módulo existente ou tenta deletar inexistente |

---

## 🌐 4. Política de CORS

A API possui política **CORS** configurada para maior segurança.

- **Origem permitida:** `http://localhost:5173`  
- **Justificativa:** Apenas o front-end oficial do HandMind pode realizar requisições à API durante o desenvolvimento, prevenindo acessos indevidos de outras origens.

---

## 📚 5. Endpoints da API

### 📄 Listar Módulos
**GET** `/api/modules`

Retorna todos os módulos de aprendizado.  
**Resposta (200 OK):**

```json
[
  {
    "id": 1,
    "title": "Saudações em Libras",
    "description": "Aprenda os cumprimentos mais comuns para iniciar uma conversa.",
    "level": 2,
    "imageUrl": "/images/saudacoes.png",
    "isLocked": false
  }
]
```

---

### 🔍 Buscar Módulo por ID
**GET** `/api/modules/:id`

**Respostas:**
- ✅ `200 OK` – Módulo encontrado  
- ⚠️ `400 Bad Request` – ID inválido (não numérico ou negativo)  
- ❌ `404 Not Found` – Módulo inexistente  

---

### ➕ Criar Módulo
**POST** `/api/modules`

**Payload Válido:**
```json
{
  "title": "Saudações em Libras",
  "description": "Aprenda os cumprimentos mais comuns para iniciar uma conversa.",
  "level": 2,
  "imageUrl": "/images/saudacoes.png",
  "isLocked": false
}
```

**Payload Inválido (título muito curto):**
```json
{
  "title": "Oi",
  "description": "Aprenda os cumprimentos mais comuns para iniciar uma conversa.",
  "level": 2,
  "imageUrl": "/images/saudacoes.png"
}
```

**Respostas:**
- ✅ `201 Created` – Módulo criado com sucesso  
- ⚠️ `400 Bad Request` – Payload inválido (validação via Zod, com array `issues` detalhando o erro)

---

### ✏️ Atualizar Módulo
**PUT** `/api/modules/:id`

**Payload Exemplo:**
```json
{
  "isLocked": true,
  "description": "Este módulo agora está bloqueado e a descrição foi atualizada."
}
```

**Respostas:**
- ✅ `200 OK` – Atualizado com sucesso  
- ⚠️ `400 Bad Request` – ID inválido ou payload incorreto  
- ❌ `404 Not Found` – Módulo não encontrado  

---

### ❌ Deletar Módulo
**DELETE** `/api/modules/:id`

**Respostas:**
- ✅ `204 No Content` – Deletado com sucesso  
- ❌ `404 Not Found` – Módulo não encontrado  

---

## 🧾 Observações Finais

- Todas as rotas retornam respostas padronizadas em JSON.  
- A validação de entrada é feita com **Zod**, garantindo mensagens de erro claras e seguras.  
- O código está estruturado para fácil extensão com novos endpoints e entidades futuras.

---

## 👨‍💻 Autor

Projeto desenvolvido para o **HandMind**, uma plataforma de aprendizado inclusiva.
