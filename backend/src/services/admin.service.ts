import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";
import { Employee } from "../entity/Employee";
import { EmpPos } from "../entity/EmpPos";
import { SkillMatrix } from "../entity/SkillMatrix";
import { Skill } from "../entity/Skill";

export class AdminService{
    private EmpRepo=AppDataSource.getRepository(Employee);
    private EmpPosRepo=AppDataSource.getRepository(EmpPos);
    private AssessmentRepo=AppDataSource.getRepository(Assessment);
    private SkillMatrixRepo=AppDataSource.getRepository(SkillMatrix);
    private SkillRepo = AppDataSource.getRepository(Skill);

    //Creation of employees by admin and position initiation
    async createEmp(data: Partial<Employee> & {positions:{pos_id:number,isPrimary:boolean}[]}) {
        const {positions,...empData}=data;
        const employee = this.EmpRepo.create(empData);
        const savedEmp = await this.EmpRepo.save(employee);

        const empPosEntries = positions.map(pos => {
            return this.EmpPosRepo.create({
              employee_id: savedEmp.employee_id,
              pos_id: pos.pos_id,
              is_primary: pos.isPrimary,
            });
          });
        await this.EmpPosRepo.save(empPosEntries);
        return savedEmp;
    }

    //View all employees
    async viewAllEmp()
    {
        const employees=this.EmpRepo.find();
        return employees;
    }

    //View by team_id
    async viewEmpByTeam(id:number)
    {
        const employees=this.EmpRepo.findBy({
            team_id:id
        });
        return employees;
    }

    //Initiation of assessment by HR
    async initiateAssessment(q_id: number, year: number,status:number) {
        const employees = await this.EmpRepo.find({where:{role_id:Not(2)}}); 
      
        const assessments = employees.map(emp => {
          return this.AssessmentRepo.create({
            quarter:q_id,
            year,
            employee_id: emp.employee_id,
          });
        });

        const savedAssessments = await this.AssessmentRepo.save(assessments);

        const skillMatrixEntries: SkillMatrix[] = [];
        const positionSkillsCache = new Map<number, Skill[]>();

        for (const assessment of savedAssessments) {
            const empPositions = await this.EmpPosRepo.find({
                where: { employee_id: assessment.employee_id },
            });

            const uniquePosIds = [...new Set(empPositions.map(ep => ep.pos_id))];
            let employeeRelevantSkills: Skill[] = [];

            for (const posId of uniquePosIds) {
                if (!positionSkillsCache.has(posId)) {
                    const skillsForThisPosition = await this.SkillRepo.find({ where: { pos_id: posId } });
                    positionSkillsCache.set(posId, skillsForThisPosition);
                }
                employeeRelevantSkills = employeeRelevantSkills.concat(positionSkillsCache.get(posId)!);
            }

            const uniqueEmployeeRelevantSkills = Array.from(new Set(employeeRelevantSkills.map(s => s.skill_id)))
                .map(skillId => employeeRelevantSkills.find(s => s.skill_id === skillId)!);

            for (const skill of uniqueEmployeeRelevantSkills) {
                skillMatrixEntries.push(
                    this.SkillMatrixRepo.create({
                        employee_id: assessment.employee_id,
                        assessment_id: assessment.assessment_id,
                        skill_id: skill.skill_id,
                        employee_rating: 0,
                        lead_rating: 0,
                        lead_comments: '',
                        hr_approval: false,
                        hr_comments: '',
                    }),
                );
            }
        }

        await this.SkillMatrixRepo.save(skillMatrixEntries);

        return { message: 'Assessments and Skill Matrix initiated for all employees.' };
      }
      
}