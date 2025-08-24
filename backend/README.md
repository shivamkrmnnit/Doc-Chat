# 🧠 LLM-Powered Local Laptop Search – Backend

This backend powers the **LLM-Powered Local Laptop Search** project, designed to allow users to upload documents locally and ask natural language questions about them. The backend handles user authentication, file ingestion, semantic search via LLM integration, and query history tracking.

---

## 📌 Project Overview

This project enables:

- **Secure user management** with authentication (JWT)
- **Document upload and parsing** for semantic search
- **LLM integration** for answering questions from documents
- **User history tracking** for past queries and responses
- A clean and modular **Node.js** backend built with **Express**, **Prisma**, and **MongoDB/PostgreSQL**

---

## ⚙️ Tech Stack

| Layer         | Technology                     |
|---------------|---------------------------------|
| Runtime       | Node.js                         |
| Server        | Express.js (v5)                 |
| Database ORM  | Prisma ORM                      |
| DB Support    | PostgreSQL & optional MongoDB   |
| Auth          | JWT, bcryptjs                   |
| LLM API       | External LLM service (via Axios)|
| Dev Tools     | Nodemon, dotenv                 |

---


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/VaibhavYadavAntino/BE_Local_Laptop_Search.git
cd backend
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
DATABASE_URL=your_prisma_url
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
LLM_API_URL=http://your-llm-server
FRONTEND_URL=http://your-client-url
```
Make sure to update each value according to your local or deployment environment.


### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the Server

For development (with auto-reload):
```bash
npm run dev
```
For production:
```bash
npm start
```


