import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProducto,
  getProductos,
} from "../controllers/productos.controller.js";
import { verifyToken } from "../controllers/user.controller.js";
const router = Router();

router.get("/products", verifyToken, getProductos);
router.get("/products/:codigo", verifyToken, getProducto);
router.post("/products", verifyToken, crearProducto);
router.patch("/products/:codigo", verifyToken, actualizarProducto);
router.delete("/products/:codigo", verifyToken, eliminarProducto);

export default router;
