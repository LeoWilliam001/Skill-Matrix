import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({type:'int', nullable:true})
    hr_id: number|null;

    @Column({type:'int', nullable:true})
    team_id: number | null;

    @Column({type:"tinyint", default:true})
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=>Assessment,(a)=>a.employee)
    assessments: Assessment[];

    @ManyToOne(()=>Role,(r)=>r.emp)
    @JoinColumn({name:'role_id'})
    role:Role;

    @ManyToOne(()=>Employee,(e)=>e.hrs)
    @JoinColumn({name:'hr_id'})
    hr:Employee;

    @OneToMany(()=>Employee,(e)=>e.hr)
    hrs:Employee[];

    @ManyToOne(()=>Team,(t)=>t.emp,{nullable:true})
    @JoinColumn({name:'team_id'})
    team:Team | null;

    @OneToMany(()=>SkillMatrix,(sm)=>sm.employee)
    skill_matrix: SkillMatrix[];

    @OneToMany(()=>Team,(t)=>t.employee)
    teams:Team[];

    @OneToMany(()=>EmpPos,(ep)=>ep.employee)
    emp_pos:EmpPos[];
}