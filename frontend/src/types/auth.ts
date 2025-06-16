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
  }

  export interface Position{
    position_id:number;
    position_name:string;
    skills:Skill[];
  }

  export interface EmplPos {
    employee_id: number;
    pos_id: number;
    is_primary: number;
    position: Position;
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
    is_active: number;
    created_at: string;
    role: Role;
    hr: HR;
    team: Team | null;
    emp_pos: EmplPos[];
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
    emp_pos: EmplPos[];
  }
  