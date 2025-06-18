import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";
import { Employee } from "../entity/Employee";
import { SkillMatrix } from "../entity/SkillMatrix";
import { Team } from "../entity/Team";

export class EmpService{
    private EmpRepo = AppDataSource.getRepository(Employee);
    private TeamRepo = AppDataSource.getRepository(Team);
    private SkillMatRepo=AppDataSource.getRepository(SkillMatrix);
    private AssessmentRepo=AppDataSource.getRepository(Assessment);

    // async viewAllMatrix(){
    //     const matrices=await this.SkillMatRepo.find();
    //     if()
    // }
    async viewmyTeamMatrix(id:number){
        const team=await this.TeamRepo.findOne({
            where:{lead_id:id}
        });
        const employees=await this.EmpRepo.find(
            {where:{team_id:team.team_id}}
        );

        const skillmats=await this.SkillMatRepo.find();
        const result = employees.map((emp) => {
            const empSkills = skillmats.filter((sm) => sm.employee_id === emp.employee_id);
            return {
                employee: emp,
                skills: empSkills,
            };
        });
        return result;
    }
    
    async viewMatrixById(emp_id:number){
        const skillmats=await this.SkillMatRepo.find({
            where:{employee_id:emp_id}
        });
        return skillmats;
    }


    async empRates(data:any[])
    {
        for(const datum of data)
        {
            const repo=await this.SkillMatRepo.findOne({
                where:{skill_matrix_id:datum.skill_matrix_id}
            })

            if (repo) {
                repo.employee_rating = datum.employee_rating;
                const assess_id=repo.assessment_id;
                const assessRepo=await this.AssessmentRepo.findOne({
                    where:{assessment_id:assess_id}
                })
                if(assessRepo)
                {
                    assessRepo.status=1;
                }
                await this.AssessmentRepo.save(assessRepo);
                await this.SkillMatRepo.save(repo);
            }
        }
        return {message:"Employee rating are saved successfully"};
    }

    async leadRates(id:number,comments:string,data:any[])
    {   
        for(const datum of data)
        {
            const repo=await this.SkillMatRepo.findOne({
                where:{skill_matrix_id:datum.skill_matrix_id}
            })

            console.log(repo);

            if (repo) {
                repo.lead_rating = datum.lead_rating;
                await this.SkillMatRepo.save(repo);
            }
            console.log(repo);
        }
        const assessRepo = await this.AssessmentRepo.findOne({
            where:{assessment_id:id}
        })
        assessRepo.lead_comments=comments;
        await this.AssessmentRepo.save(assessRepo);
        return {message:"Lead rating are saved successfully"};
    }

    async getMyTeams(id:number)
    {
        const team=await this.TeamRepo.findOneBy({'lead_id':id});
        if(team)
        {
            const members=await this.EmpRepo.find({
                where:{'team_id':team.team_id}
            })
            if(!members)
            {
                return null;
            }
            return members;
        }
        return null;
    }
}