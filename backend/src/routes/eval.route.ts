import { Router } from "express";
import { getAssessmentbyId, getAssessmentbyRoles, getMatricesByAssess, getTeamMatrixByQandY, hrApprovalbyAssess, submitAssessbyRole } from "../controllers/eval.controller";

const router=Router();

router.get("/assessByEmp/:id",getAssessmentbyId);
router.get("/matricesByAssess/:id",getMatricesByAssess);
router.post("/getAssessbyRole/:id",getAssessmentbyRoles);
router.post("/submitAssessbyRole/:id",submitAssessbyRole);
router.patch("/hrApproval/:id",hrApprovalbyAssess);
router.post("/getTeamMatrices/:id",getTeamMatrixByQandY);
export default router;