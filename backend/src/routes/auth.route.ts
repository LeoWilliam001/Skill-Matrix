import { loginUser } from "../controllers/auth.controller";
import { Router } from "express";

const router=Router();

router.post("/login",loginUser);

export default router;