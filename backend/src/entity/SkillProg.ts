import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./Position";
import { Skill } from "./Skill";

@Entity('skill_progressions')
export class SkillProg
{
    @PrimaryGeneratedColumn()
    path_id: number;

    @Column({type:'int'})
    skill_id: number;

    @Column({type:'int'})
    from_level_id: number;

    @Column({type:'int'})
    to_level_id: number;

    @Column({type:'text'})
    guidance: string;

    @Column({type:'text'})
    resources_link: string;

    @ManyToOne(()=>Skill,(s)=>s.skill_progs)
    @JoinColumn({name:'skill_id'})
    skill:Skill;
}