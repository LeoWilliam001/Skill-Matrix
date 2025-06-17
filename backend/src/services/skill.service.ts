import { AppDataSource } from "../data-source";
import { Position } from "../entity/Position";
import { Skill } from "../entity/Skill";
import { SkillDesc } from "../entity/SkillDesc";
import { SkillProg } from "../entity/SkillProg";

export class SkillService{
    private skillCriteriaRepo= AppDataSource.getRepository(SkillDesc);
    private skillRepo= AppDataSource.getRepository(Skill);
    private skillProgRepo= AppDataSource.getRepository(SkillProg);
    private positionRepo=AppDataSource.getRepository(Position);

    async getCriteria(skill_id:number){
        const desc=await this.skillCriteriaRepo.find({
            where:{skill_id:skill_id},
            relations: ['skill']
        });
        return desc;
    }

    async editCriteria(level_id:number,desc:string)
    {
        const criteria=await this.skillCriteriaRepo.findOne({
            where:{level_id:level_id}
        })
        if(!criteria)
        {
            return null;
        }
        criteria.description=desc;
        await this.skillCriteriaRepo.save(criteria);
        return{message:"Saved the Description successfully"};
    }

    async getSkills()
    {
        const skills=await this.skillRepo.find();
        return skills;
    }

    async getPositions()
    {
        const pos=await this.positionRepo.find({
            relations:['skills']
        });
        return pos;
    }

    async getGuide(id: number)
    {
        const guide=await this.skillProgRepo.find({
            where:{skill_id:id},
            relations:['skill']
        })
        return guide;
    }

}
