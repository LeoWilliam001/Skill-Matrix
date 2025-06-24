import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";
import { Employee } from "../entity/Employee";
import { EmpPos } from "../entity/EmpPos";
import { SkillMatrix } from "../entity/SkillMatrix";
import { Skill } from "../entity/Skill";
import { error } from "console";
import { Role } from "../entity/Role";
import { Position } from "../entity/Position";
import { Team } from "../entity/Team";
import { scheduleAssessmentCloser } from "../job/scheduleClosure";

export class AdminService{
    private EmpRepo=AppDataSource.getRepository(Employee);
    private EmpPosRepo=AppDataSource.getRepository(EmpPos);
    private AssessmentRepo=AppDataSource.getRepository(Assessment);
    private SkillMatrixRepo=AppDataSource.getRepository(SkillMatrix);
    private SkillRepo = AppDataSource.getRepository(Skill);
    private RoleRepo=AppDataSource.getRepository(Role);
    private PosRepo = AppDataSource.getRepository(Position);
    private teamRepo=AppDataSource.getRepository(Team);

    //Creation of employees by admin and position initiation
    async createEmp(data: Partial<Employee> & {position:{pos_id:number,isPrimary:boolean}[]}) {
        const {position,...empData}=data;
        const employee = this.EmpRepo.create(empData);
        const savedEmp = await this.EmpRepo.save(employee);

        const empPosEntries = position.map(pos => {
            return this.EmpPosRepo.create({
              employee_id: savedEmp.employee_id,
              pos_id: pos.pos_id,
              is_primary: pos.isPrimary,
            });
          });
        await this.EmpPosRepo.save(empPosEntries);
        return savedEmp;
    }

    async updateEmp(data:Partial<Employee>)
    {
        const empRepo=await this.EmpRepo.findOne({
            where:{employee_id:data.employee_id}
        })
        if(!empRepo)
        {
            throw error;
        }
        Object.assign(empRepo, data);
        return await this.EmpRepo.save(empRepo);
    }

    //View all employees
    async viewAllEmp()
    {
        const employees=this.EmpRepo.find({
          relations:['hr','role','designation','team']
        });
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
            lead_comments: '',
            hr_approval: 0,
            hr_comments: '',
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
                    }),
                );
            }
        }

        await this.SkillMatrixRepo.save(skillMatrixEntries);
        for (const assessment of savedAssessments) {
            scheduleAssessmentCloser(assessment.assessment_id, new Date());
          }
        return { message: 'Assessments and Skill Matrix initiated for all employees.' };
      }

      //Initiate assessment by ID
      async initiateAssessmentById(empId: number, q_id: number, year: number) {
        const employee = await this.EmpRepo.findOne({
          where: { employee_id: empId },
        });
      
        if (!employee) {
          throw new Error(`Employee with ID ${empId} not found`);
        }
      
        const assessment = this.AssessmentRepo.create({
          quarter: q_id,
          year,
          employee_id: empId,
          lead_comments: '',
          hr_approval: 0,
          hr_comments: '',
        });
      
        const savedAssessment = await this.AssessmentRepo.save(assessment);
      
        const empPositions = await this.EmpPosRepo.find({
          where: { employee_id: empId },
        });
      
        const uniquePosIds = [...new Set(empPositions.map(ep => ep.pos_id))];
        const positionSkillsCache = new Map<number, Skill[]>();
        let employeeRelevantSkills: Skill[] = [];
      
        for (const posId of uniquePosIds) {
          if (!positionSkillsCache.has(posId)) {
            const skillsForThisPosition = await this.SkillRepo.find({
              where: { pos_id: posId },
            });
            positionSkillsCache.set(posId, skillsForThisPosition);
          }
          employeeRelevantSkills = employeeRelevantSkills.concat(positionSkillsCache.get(posId)!);
        }
      
        const uniqueEmployeeRelevantSkills = Array.from(
          new Set(employeeRelevantSkills.map(s => s.skill_id))
        ).map(skillId => employeeRelevantSkills.find(s => s.skill_id === skillId)!);
      
        const skillMatrixEntries = uniqueEmployeeRelevantSkills.map(skill =>
          this.SkillMatrixRepo.create({
            employee_id: empId,
            assessment_id: savedAssessment.assessment_id,
            skill_id: skill.skill_id,
            employee_rating: 0,
            lead_rating: 0,
          })
        );
      
        await this.SkillMatrixRepo.save(skillMatrixEntries);
      
        scheduleAssessmentCloser(savedAssessment.assessment_id, new Date());
      
        return { message: `Assessment and Skill Matrix initiated for employee ${empId}.` };
      }
      
 
      async getRoles()
      {
        const roles=await this.RoleRepo.find();
        if(!roles)
        {
            return;
        }
        return roles;
      }

      async getHrs()
      {
        const hrs=await this.EmpRepo.find({
            where:{role_id:2}
        });
        if(!hrs)
        {
            return;
        }
        return hrs;
      }

      async getPositions()
      {
        const positions=await this.PosRepo.find();
        if(!positions)
        {
            return;
        }
        return positions;
      }
      
      async getTeams()
      {
        const teams=await this.teamRepo.find();
        if(!teams)
        {
            return;
        }
        return teams;
      }
}