import { createEmp, startAssessment, viewAll, viewTeamById } from "../controllers/admin.controller";
import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticateUser, authorizeRoles([2]), createEmp); 
router.get("/allEmp", authenticateUser, authorizeRoles([2]), viewAll); 
router.get("/emp/:id", authenticateUser, authorizeRoles([2]), viewTeamById); 
router.post("/startAssess", authenticateUser, authorizeRoles([2]), startAssessment);

export default router;