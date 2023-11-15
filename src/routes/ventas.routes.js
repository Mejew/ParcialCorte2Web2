import { Router } from "express";
import {
  actualizarVentas,
  crearVentas,
  eliminarVentas,
  getVenta,
  getVentas,
} from "../controllers/ventas.controller.js";
import { verifyToken } from "../controllers/user.controller.js";
const router = Router();
router.get("/sales", verifyToken, getVentas);
router.get("/sales/:codigo", verifyToken, getVenta);
router.post("/sales", verifyToken, crearVentas);
router.patch("/sales/:codigo", verifyToken, actualizarVentas);
router.delete("/sales/:codigo", verifyToken, eliminarVentas);

export default router;
