# 📄 Doc-Chat  

Doc-Chat is an intelligent document assistant that allows you to **upload documents (PDFs, text, etc.) and interact with them using natural language**. Powered by modern AI and retrieval techniques, it makes document exploration fast and intuitive.  

---

## ✨ Features  

- 📂 **Upload Documents** – Upload PDFs or text files for analysis.  
- 💬 **Chat with Docs** – Ask context-based questions and get accurate answers.  
- 🔍 **Smart Search** – Retrieves relevant sections instead of the whole document.  
- 🗂️ **Chat History** – Review and revisit past conversations.  
- 🔒 **Secure Authentication** – User-specific document management.  
- ⚡ **Fast & Scalable** – Optimized backend with Node.js / Express.  

---

## 🛠️ Tech Stack  

**Frontend**  
- React.js / Next.js  
- Tailwind CSS (UI Styling)  
- Axios for API calls  

**Backend**  
- Node.js / Express.js  
- FastAPI (for AI-powered semantic search)  
- MongoDB (user & document storage)  

**AI/ML**  
- OpenAI API / LangChain  
- RAG (Retrieval-Augmented Generation)  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/shivamkrmnnit/Doc-Chat.git
cd Doc-Chat
```

### 2️⃣ Install dependencies  
For frontend:  
```bash
cd client
npm install
```

For backend:  
```bash
cd server
npm install
```

### 3️⃣ Setup environment variables  
Create a `.env` file in both `client` and `server` directories:  

```env
# Backend
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENAI_API_KEY=your_api_key
PORT=5000

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### 4️⃣ Run the project  
Backend:  
```bash
cd server
npm run dev
```

Frontend:  
```bash
cd client
npm start
```

Now open 👉 [http://localhost:3000](http://localhost:3000)  

---

## 📸 Screenshots  

*(Add your app screenshots here)*  

---

## 📌 Roadmap  

- [ ] Support more document formats (.docx, .pptx)  
- [ ] Multi-user collaboration  
- [ ] Real-time chat with Socket.io  
- [ ] Deploy on Vercel / Render / AWS  

---

## 🤝 Contributing  

Contributions are welcome! Please fork the repo and submit a pull request.  

---

## 📜 License  

This project is licensed under the **MIT License**.  

---

## 👨‍💻 Author  

**Shivam Kumar**  
- 🌐 [Portfolio](#)  
- 🐙 [GitHub](https://github.com/shivamkrmnnit)  
- 💼 [LinkedIn](#)  
