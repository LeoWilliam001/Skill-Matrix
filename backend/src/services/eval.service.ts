import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";
import { Employee } from "../entity/Employee";
import { SkillMatrix } from "../entity/SkillMatrix";
import { Team } from "../entity/Team";

export class EvalService{
    private assessmentRepo=AppDataSource.getRepository(Assessment);
    private skillMatrixRepo=AppDataSource.getRepository(SkillMatrix);
    private employeeRepo=AppDataSource.getRepository(Employee);
    private teamRepo=AppDataSource.getRepository(Team);
    async getAssessmentbyId(id:number){
        const assessment=await this.assessmentRepo.findOne({
            where:{employee_id:id,
                status:0,
                is_active:true,
            }
        })
        if(assessment)
        {
            return assessment
        }
        return;
    }

    async getAssessmentbyRole(id:number,role_name:string)
    {
        if (role_name === "Employee" || role_name === "Lead") {
            const assessRepo = await this.assessmentRepo.findOne({
              where: {
                employee_id: id,
                status: 0,
                is_active: true,
              },
            });
          
            if (role_name === "Employee") {
              return {
                self: assessRepo ?? null,
                team: null,
              };
            }
          
            if (role_name === "Lead") {
              const team=await this.teamRepo.findOneBy({'lead_id':id});
              const teamMembers = await this.employeeRepo.find({
                where: {
                  team_id: team.team_id,
                },
              }); 
          
              const teamMemberIds = teamMembers.map(emp => emp.employee_id).filter(eid => eid !== id);
          
              const memberAssessments = await this.assessmentRepo.find({
                where: {
                  employee_id: In(teamMemberIds),
                  status: 1,
                  is_active: true,
                },
                relations:['employee','skill_matrix']
              });
          
              return {
                self: assessRepo ?? null,
                team: memberAssessments,
              };
            }
          }

        else if(role_name=="HR")
        {
            const members = await this.employeeRepo.find({
                where: {
                  hr_id:id,
                },
              });
            
            const memberIds=members.map(emp => emp.employee_id).filter(eid => eid !== id);
            console.log(memberIds);
            const memberAssess = await this.assessmentRepo.find({
                where: {
                  employee_id: In(memberIds),
                  status: 2,
                  is_active: true,
                },
                relations:['skill_matrix','skill_matrix.skill','employee']
              });
            return {
                self:null,
                team:memberAssess
            }
        }
    }

    async submitAssessbyRole(id:number,data:any[])
    {
        for(const datum of data)
          {
              const repo=await this.skillMatrixRepo.findOne({
                  where:{skill_matrix_id:datum.skill_matrix_id}
              })

              if (repo.employee_id===id) {
                  repo.employee_rating = datum.employee_rating;
                  const assess_id=repo.assessment_id;
                  const assessRepo=await this.assessmentRepo.findOne({
                      where:{assessment_id:assess_id}
                  })
                  if(assessRepo)
                  {
                      assessRepo.status=1;
                  }
                  await this.assessmentRepo.save(assessRepo);
                  await this.skillMatrixRepo.save(repo);
              }
              else{
                  repo.lead_rating = datum.employee_rating;
                  const assess_id=repo.assessment_id;
                  const assessRepo=await this.assessmentRepo.findOne({
                      where:{assessment_id:assess_id}
                  })
                  if(assessRepo)
                  {
                      assessRepo.status=2;
                  }
                  await this.assessmentRepo.save(assessRepo);
                  await this.skillMatrixRepo.save(repo);
              }
          }

          return {message:"Employee rating are saved successfully"};
    }

    async hrApprovalbyAssess(id:number,comments:string){
      const assessment=await this.assessmentRepo.findOneBy({
        assessment_id:id
      })
      if(!assessment)
      {
        return null;
      }
      assessment.hr_approval=true;
      assessment.hr_comments=comments;
      assessment.status=3;
      return await this.assessmentRepo.save(assessment);
    }

    async getMatrixByAssess(id:number)
    {
        const matrices=await this.skillMatrixRepo.find({
            where:{
                assessment_id:id
            },
            relations:['skill']
        })
        if(matrices)
        {
            return matrices;
        }
        return;
    }

    async getTeamMatrixByQandY(e_id:number,quarter:number, year:number)
    {
      const team=await this.teamRepo.findOneBy({'lead_id':e_id});
      const members=await this.employeeRepo.find({
        where:{}
      })

      const teamMemberIds = members.map(emp => emp.employee_id).filter(eid => eid !== e_id);
      
      const memberAssessments = await this.assessmentRepo.find({
        where: {
          employee_id: In(teamMemberIds),
          quarter: quarter,
          year: year,
        },
        relations:['employee','skill_matrix']
      });
      if(memberAssessments)
      {
        memberAssessments;
      }
      return null;
    }
}