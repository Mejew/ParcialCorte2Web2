import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import indexRoutes from "./routes/index.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
app.use(express.json());
// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Reemplaza con tu dominio de frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/api", productosRoutes);
app.use("/api", ventasRoutes);
app.use("/api", userRouter);

app.use(indexRoutes);
app.use((req, res, next) => {
  res.status(400).json({
    message: "Endpoint not found",
  });
});

export default app;
