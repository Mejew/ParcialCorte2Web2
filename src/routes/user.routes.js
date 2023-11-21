import { Router } from "express";
import {
  getuser,
  loginUser,
  protectedRoute,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/login", loginUser);
router.post("/registrar", registerUser);
router.get("/user", getuser);
router.post("/protected", verifyToken, protectedRoute);

export default router;
