import { Router } from "express";
import {
  actualizarVentas,
  crarVentas,
  eliminarVentas,
  getVenta,
  getVentas,
} from "../controllers/ventas.controller.js";
const router = Router();
router.get("/sales", getVentas);
router.get("/sales/:codigo", getVenta);
router.post("/sales", crarVentas);
router.patch("/sales/:codigo", actualizarVentas);
router.delete("/sales/:codigo", eliminarVentas);

export default router;
