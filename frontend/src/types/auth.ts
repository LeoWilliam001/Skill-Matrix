export interface Role {
    role_id: number;
    role_name: string;
  }
  
  export interface HR {
    employee_id: number;
    employee_name: string;
    email: string;
    password: string;
    role_id: number;
    hr_id: number | null;
    team_id: number | null;
    is_active: number;
    created_at: string;
  }
  
  export interface Team {
    team_id: number;
    team_name: string;
    lead_id: number;
    created_at: string;
  }
  
  export interface User {
    employee_id: number;
    employee_name: string;
    email: string;
    password: string;
    role_id: number;
    hr_id: number | null;
    team_id: number | null;
    is_active: number;
    created_at: string;
    role: Role;
    hr?: HR | null;
    team?: Team | null;
  }
  
  export interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
  }
  
  