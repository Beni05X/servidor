import express from "express";
import { 
  register, 
  loginPassword, 
  loginPIN,
  configurarPIN 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login-password", loginPassword);
router.post("/login-pin", loginPIN);
router.post("/config-pin", configurarPIN);

export default router;
