export interface Role {
    role_id: number;
    role_name: string;
  }
  
  export interface Emp{
    employee_id: number;
    employee_name: string;
    email: string;
  }

  export interface HR {
    employee_id: number;
    employee_name: string;
    email: string;
    role_id: number;
    hr_id: number | null;
    age:number | null;
    gender:string | null;
    location:string | null;
    nationality:string | null;
    marital_status: string | null;
    team_id: number | null;
    is_active: number;
    created_at: string;
  }
  
  export interface Team {
    team_id: number;
    team_name: string;
    lead_id: number;
    created_at: string;
    lead: Emp;
  }
  
  export interface Skill{
    skill_id:number;
    skill_name:string;
    pos_id:number;
    desc: SkillDesc[];
  }

  export interface Position{
    position_id:number;
    position_name:string;
    skills:Skill[];
  }

  export interface EmplPos {
    // employee_id: number;
    pos_id: number;
    isPrimary: boolean;
  }

  export interface EmployeePos {
    // employee_id: number;
    pos_id: number;
    position: Position;
    is_primary: boolean;
  }

  export interface User {
    employee_id: number;
    employee_name: string;
    email: string;
    role_id: number;
    hr_id: number | null;
    team_id: number | null;
    age:number | null;
    gender:string | null;
    location:string | null;
    nationality:string | null;
    marital_status: string | null;
    desig_id:number;
    is_active: number;
    created_at: string;
    role: Role;
    hr: HR;
    team: Team | null;
    emp_pos: EmployeePos[];
  }

  export interface Designation{
    d_id:number;
    desig_name:string;
  }
  
  export interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
  }
  
  export interface Dev {
    employee_id: number;
    employee_name: string;
    email: string;
    password:string;
    role_id: number;
    hr_id: number | null;
    team_id: number | null;
    age:number | null;
    gender:string | null;
    location:string | null;
    nationality:string | null;
    marital_status: string | null;
    is_active: number;
    created_at: string;
    role: Role;
    hr: HR;
    team: Team | null;
    position: EmplPos[];
  }
  
  export interface Assessments{
    assessment_id: number,
    employee_id: number,
    quarter: number,
    year: number,
    status: number,
    lead_comments: string,
    hr_approval: boolean,
    hr_comments: string,
    is_active: boolean,
    initiated_at: Date,
    employee:User
    skill_matrix:SkillMatrix[]
  }
  
  export interface SkillMatrix{
    skill_matrix_id: number;
    employee_id: number;
    assessment_id: number;
    skill_id: number;
    employee_rating: number;
    lead_rating: number;
    created_at: string;
  }

  export interface Matrix
  {
    skill_matrix_id: number,
    employee_id: number,
    assessment_id: number,
    skill_id: number,
    skill:Skill,
    employee_rating: number,
    lead_rating: number,
  }

  export type Gender = "Male" | "Female" | "Non-Binary" | "Prefer not to respond" | "Transgender";

  export type MaritalStatus = "Single" | "Married" | "Widowed" | "Separated";


export interface SkillDesc
{
  level_id: number;
  skill_id: number;
  level_number: number;
  description: string;
}
export interface SkillGuide
{
  path_id: number;
  skill_id: number;
  from_level_id: number;
  to_level_id: number;
  guidance: string;
  resources_link: string;
  skill: Skill;
}