import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EmpPos } from "./EmpPos";
import { SkillProg } from "./SkillProg";
import { Skill } from "./Skill";

@Entity('positions')
export class Position{
    @PrimaryGeneratedColumn()
    position_id: number;

    @Column({type:'varchar', nullable:false})
    position_name: string;

    @OneToMany(()=>EmpPos,(ep)=>ep.position)
    emp_pos:EmpPos[];

    @OneToMany(()=>Skill,(s)=>s.position)
    skills:Skill[];
}