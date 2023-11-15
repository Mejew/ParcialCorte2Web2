import { Router } from "express";
import {
  getuser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/registrar", registerUser);
router.get("/user", getuser);
export default router;
