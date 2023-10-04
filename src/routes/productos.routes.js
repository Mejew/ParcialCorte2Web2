import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProducto,
  getProductos,
} from "../controllers/productos.controller.js";
const router = Router();

router.get("/products", getProductos);
router.get("/products/:codigo", getProducto);
router.post("/products", crearProducto);
router.patch("/products/:codigo", actualizarProducto);
router.delete("/products/:codigo", eliminarProducto);

export default router;
