import { createEmp, getHrs, getPositions, getRoles, getTeams, startAssessment, updateEmp, viewAll, viewTeamById } from "../controllers/admin.controller";
import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticateUser, authorizeRoles([2]), createEmp); 
router.get("/allEmp", authenticateUser, authorizeRoles([2]), viewAll); 
router.get("/emp/:id", authenticateUser, authorizeRoles([2]), viewTeamById); 
router.post("/startAssess", authenticateUser, authorizeRoles([2]), startAssessment);
router.patch("/updateEmp",authenticateUser,updateEmp);
router.get("/roles",getRoles);
router.get("/hrs",getHrs);
router.get("/teams",getTeams);
router.get("/positions",getPositions);
export default router;