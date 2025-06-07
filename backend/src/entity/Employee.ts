import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Assessment } from "./Assessment";
import { Team } from "./Team";
import { Role } from "./Role";
import { SkillMatrix } from "./SkillMatrix";
import { EmpPos } from "./EmpPos";

@Entity('employees')
export class Employee
{
    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column({type:'varchar'})
    employee_name: string;

    @Column({type:'varchar'})
    email: string;

    @Column({type:'varchar'})
    password: string;

    @Column({type:'int'})
    role_id: number;

    @Column({type:'int'})
    team_id: number;

    @Column({type:"tinyint", default:true})
    is_active: boolean;

    @Column({type:'timestamp'})
    created_at: Date;

    @OneToMany(()=>Assessment,(a)=>a.employee)
    assessments: Assessment[];

    @ManyToOne(()=>Role,(r)=>r.emp)
    @JoinColumn({name:'role_id'})
    role:Role;

    @ManyToOne(()=>Team,(t)=>t.emp)
    @JoinColumn({name:'team_id'})
    team:Team;

    @OneToMany(()=>SkillMatrix,(sm)=>sm.employee)
    skill_matrix: SkillMatrix[];

    @OneToMany(()=>Team,(t)=>t.employee)
    teams:Team[];

    @OneToMany(()=>EmpPos,(ep)=>ep.employee)
    emp_pos:EmpPos[];
}