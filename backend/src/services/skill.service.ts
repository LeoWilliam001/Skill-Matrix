import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";
import { Employee } from "../entity/Employee";
import { Position } from "../entity/Position";
import { Skill } from "../entity/Skill";
import { SkillDesc } from "../entity/SkillDesc";
import { SkillMatrix } from "../entity/SkillMatrix";
import { SkillProg } from "../entity/SkillProg";
import { Team } from "../entity/Team";

export class SkillService{
    private assessRepo=AppDataSource.getRepository(Assessment);
    private skillCriteriaRepo= AppDataSource.getRepository(SkillDesc);
    private skillRepo= AppDataSource.getRepository(Skill);
    private skillProgRepo= AppDataSource.getRepository(SkillProg);
    private positionRepo=AppDataSource.getRepository(Position);
    private skillMatrixRepo=AppDataSource.getRepository(SkillMatrix);
    private employeeRepo=AppDataSource.getRepository(Employee);
    private teamRepo=AppDataSource.getRepository(Team);

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

    async getSkillMatrixById(id:number)
    {
        const skillMatrix=await this.skillMatrixRepo.find({
            where:{employee_id:id},
            relations:['skill']
        })
        if(skillMatrix==null)
        {
            return null;
        }
        return skillMatrix;
    }

    async getSkillMatrixByLead(id:number)
    {
        const team=await this.teamRepo.findOneBy({
            lead_id:id
        })
        if(team)
        {
            const teamMembers = await this.employeeRepo.find({
                where: {
                  team_id: team.team_id,
                },
              });
              const teamMemberIds = teamMembers.map(emp => emp.employee_id).filter(eid => eid !== id); 

              const memberAssessments = await this.assessRepo.find({
                where: {
                  employee_id: In(teamMemberIds),
                  status: 3,
                },
                relations:['employee','skill_matrix','skill_matrix.skill']
              });
              return memberAssessments? memberAssessments:null;
        }
        return {"service":"Miscomm: not a lead"};
    }
}
