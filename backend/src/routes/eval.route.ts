import { Router } from "express";
import { getAssessmentbyId, getAssessmentbyRoles, getMatricesByAssess } from "../controllers/eval.controller";

const router=Router();

router.get("/assessByEmp/:id",getAssessmentbyId);
router.get("/matricesByAssess/:id",getMatricesByAssess);
router.post("/getAssessbyRole/:id",getAssessmentbyRoles);

export default router;