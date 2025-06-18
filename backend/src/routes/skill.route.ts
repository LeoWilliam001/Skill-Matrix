import { editCriteria, getAllSkills, getCriteria, getPositions, getSkillMatrixById, getSkillMatrixByLead, getUpgradeGuide } from "../controllers/skill.controller";
import {Router} from 'express';

const router=Router();

router.get('/getCriteria/:id',getCriteria);
router.patch('/editCriteria/:level_id',editCriteria);
router.get('/getAllSkills',getAllSkills);
router.get('/getUpgradeGuide/:id',getUpgradeGuide);
router.get('/getPositions',getPositions);
router.get("/getMatricesById/:id",getSkillMatrixById);
router.get("/getMatricesByLead/:id",getSkillMatrixByLead);
export default router;