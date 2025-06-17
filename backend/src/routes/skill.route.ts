import { editCriteria, getAllSkills, getCriteria, getPositions, getUpgradeGuide } from "../controllers/skill.controller";
import {Router} from 'express';

const router=Router();

router.get('/getCriteria/:id',getCriteria);
router.patch('/editCriteria/:level_id',editCriteria);
router.get('/getAllSkills',getAllSkills);
router.get('/getUpgradeGuide/:id',getUpgradeGuide);
router.get('/getPositions',getPositions);
export default router;