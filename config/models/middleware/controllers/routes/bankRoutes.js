import express from "express";
import { register, login, getBalance, deposit, withdraw } from "../controllers/bankController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/balance", protect, getBalance);
router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);

export default router;
