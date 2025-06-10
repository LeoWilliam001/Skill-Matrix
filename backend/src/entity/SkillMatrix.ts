import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Assessment } from "./Assessment";
import { Employee } from "./Employee";
import { Skill } from "./Skill";

@Entity('skill_matrix')
export class SkillMatrix
{
    @PrimaryGeneratedColumn()
    skill_matrix_id:number;

    @Column({type:'int'})
    employee_id: number;

    @Column({type:'int'})
    assessment_id: number;

    @Column({type:'int'})
    skill_id: number;

    @Column({type:'int'})
    employee_rating: number;

    @Column({type:'int'})
    lead_rating: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(()=>Assessment,(a)=>a.skill_matrix)
    @JoinColumn({name:'assessment_id'})
    assessment:Assessment;

    @ManyToOne(()=>Employee,(e)=>e.skill_matrix)
    @JoinColumn({name:'employee_id'})
    employee:Employee;

    @ManyToOne(()=>Skill,(s)=>s.skill_matrix)
    @JoinColumn({name:'skill_id'})
    skill:Skill;
}