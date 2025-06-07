import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";

@Entity('role_skill_thresholds')
export class RoleSkill
{
    @PrimaryGeneratedColumn()
    rst_id: number;

    @Column({type:'int'})
    skill_id: number;

    @Column({type:'int'})
    junior_threshold: number;

    @Column({type:'int'})
    associate_threshold: number;

    @Column({type:'int'})
    senior_threshold: number;
    
    @ManyToOne(()=>Skill,(s)=>s.role_skills)
    @JoinColumn({name:'skill_id'})
    skill: Skill;
}