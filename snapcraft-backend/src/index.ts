import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storageRoutes from "./routes/storageRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend
app.use(express.json({ limit: "10mb" }));
app.use("/api", storageRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "C0mrad Backend Running! 🚀", date: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🔥 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
});