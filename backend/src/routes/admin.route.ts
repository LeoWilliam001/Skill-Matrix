import { createEmp, startAssessment, viewAll, viewTeamById } from "../controllers/admin.controller";
import { Router } from "express";

const router = Router();

router.post('/',createEmp);
router.get("/allEmp",viewAll);
router.get("/emp/:id",viewTeamById);
router.post("/startAssess",startAssessment);
export default router;