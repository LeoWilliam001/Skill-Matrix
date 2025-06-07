import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Skill } from "./Skill";

@Entity('skill_levels')
export class SkillDesc
{
    @PrimaryGeneratedColumn()
    level_id: number;

    @Column({type:'int'})
    skill_id: number;

    @Column({type:'int'})
    level_number: number;

    @Column({type:'text'})
    description: string;

    @ManyToOne(()=>Skill,(s)=>s.skill_descs)
    @JoinColumn({name:'skill_id'})
    skill:Skill;
}