import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./config/db.js";
import documentRoutes from "./routes/documents.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";
import queries from "./routes/queries.js";
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();



const app = express();

app.use(express.json());

const FRONT_END = process.env.FRONTEND_URL || 'http://localhost:5173';

const DB = process.env.DATABASE_URL
app.use(cors({
  origin: FRONT_END,
  credentials: true,
}));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/queries", queries); // Assuming queries are handled in documentRoutes

app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 6001;


const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log("Backend server is running:");
    });
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected on termination");
  process.exit(0);
});
