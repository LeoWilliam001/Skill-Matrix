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
import { Designation } from "../entity/Designation";

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
            relations:['skill','skill.skill_descs']
        })
        return guide;
    }

    async getSkillMatrixById(id:number)
    {
        const skillMatrix=await this.skillMatrixRepo.find({
            where:{employee_id:id},
            relations:['skill','skill.position']
        })
        if(skillMatrix==null)
        {
            return null;
        }
        return skillMatrix;
    }

    async getRecentSkillMatrixById(id:number)
    {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentQuarter = Math.ceil(currentMonth / 3);
        const finishedAssessment = await this.assessRepo.find({
            where: {
                employee_id: id,
                is_active: false, 
                status:3
            },
            order: {
                year: 'DESC',
                quarter: 'DESC',
            },
        });
        console.log(finishedAssessment);
        if(finishedAssessment.length>0)
        {
            return await this.skillMatrixRepo.find({
            where:{
                assessment_id:finishedAssessment[0].assessment_id
            },
            relations:['skill','skill.position']
        })}
        return null;
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
                relations:['employee','employee.designation','skill_matrix','skill_matrix.skill','skill_matrix.skill.position']
              });
              return memberAssessments? memberAssessments:null;
        }
        return {"service":"Miscomm: not a lead"};
    }

    async getDesigTargetById(id: number) {
        const employee = await this.employeeRepo.findOne({
          where: { employee_id: id },
          relations: ['designation']
        });
      
        if (!employee) throw new Error("Employee not found");
      
        const designationId = employee.designation.d_id;
      
        const data = await this.employeeRepo
          .createQueryBuilder('emp')
          .leftJoin('emp.emp_pos', 'ep')
          .leftJoin('ep.position', 'pos')
          .leftJoin('pos.skills', 'skill')
          .leftJoin('threshold_values', 'tv', 'tv.skill_id = skill.skill_id AND tv.d_id = :desigId', { desigId: designationId })
          .select([
            'skill.skill_id',
            'skill.skill_name',
            'tv.threshold_value'
          ])
          .where('emp.employee_id = :id', { id })
          .getRawMany();
      
        return data;
      }
      
}
