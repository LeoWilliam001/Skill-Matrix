import { Router } from "express";
import { empRates, getMatrixById, getMyTeam, getTeamMatrix, leadRates } from "../controllers/emp.controller";

const router=Router();

router.get("/teamMatrix/:id",getTeamMatrix);
router.get("/myMatrix/:id",getMatrixById);
router.patch("/matrix/rate",empRates);
router.patch("/matrix/leadRate",leadRates);
router.get("/getMyTeam/:id",getMyTeam);

export default router;