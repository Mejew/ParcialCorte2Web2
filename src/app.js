import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import indexRoutes from "./routes/index.routes.js";
const app = express();
app.use(express.json());
app.use("/api", productosRoutes);
app.use("/api", ventasRoutes);
app.use(indexRoutes);
app.use((req, res, next) => {
  res.status(400).json({
    menssage: "Endpoint not found",
  });
});
app.get("/", (req, res) => {
  res.send("hola desde expres");
});
export default app;
