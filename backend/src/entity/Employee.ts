import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Assessment } from "./Assessment";
import { Team } from "./Team";
import { Role } from "./Role";
import { SkillMatrix } from "./SkillMatrix";
import { EmpPos } from "./EmpPos";
import { Designation } from "./Designation";

export enum Gender{
    Male="Male",
    Female="Female",
    Non_Binary="Non-Binary",
    NoPreference="Prefer not to respond",
    Transgender="Transgender"
}

export enum MaritalStatus{
    Single="Single",
    Married="Married",
    Widowed="Widowed",
    Separated="Separated"
}

@Entity('employees')
export class Employee
{
    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column({type:'varchar'})
    employee_name: string;

    @Column({type:'varchar'})
    email: string;

    @Column({type:'int'})
    age: number;

    @Column({type:'enum',enum:Gender})
    gender: Gender;

    @Column({type:'varchar'})
    password: string;

    @Column({type:'varchar'})
    location:string;

    @Column({type:'varchar'})
    nationality: string;

    @Column({ type: 'int', nullable: true })
    desig_id: number;

    @Column({type:'enum',enum:MaritalStatus,default:MaritalStatus.Single})
    marital_status: MaritalStatus;

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

    @ManyToOne(() => Designation, (designation) => designation.employees)
    @JoinColumn({ name: 'desig_id' })
    designation: Designation;


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

    @OneToMany(()=>Team,(t)=>t.lead)
    teams:Team[];

    @OneToMany(()=>EmpPos,(ep)=>ep.employee)
    emp_pos:EmpPos[];
}