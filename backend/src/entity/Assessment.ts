import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SkillMatrix } from "./SkillMatrix";
import { Employee } from "./Employee";

@Entity('assessments')
export class Assessment{
    @PrimaryGeneratedColumn()
    assessment_id:number;

    @Column({type:'int'})
    employee_id:number;

    @Column({type:'int'})
    quarter: number;

    @Column({type:'int'})
    year: number;

    @Column({type:'int',default:0})
    @Column({type:'int',default:0})
    status: number;

    @Column({type:'text'})
    lead_comments: string;

    @Column({type:'tinyint'})
    hr_approval:boolean;

    @Column({type:'text'})
    hr_comments: string;

    @Column({type:'tinyint',default:true})
    is_active: boolean;

    @CreateDateColumn({type:'timestamp'})
    @CreateDateColumn({type:'timestamp'})
    initiated_at:Date;

    @CreateDateColumn({type:'timestamp'})
    @CreateDateColumn({type:'timestamp'})
    updated_at: Date;

    @OneToMany(()=>SkillMatrix,(sm)=>sm.assessment)
    skill_matrix:SkillMatrix[];

    @ManyToOne(()=>Employee,(e)=>e.assessments)
    @JoinColumn({name: 'employee_id'})
    employee: Employee;
}