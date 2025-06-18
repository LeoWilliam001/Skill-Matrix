import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Position } from "./Position";
import { Threshold } from "./Threshold";
import { SkillProg } from "./SkillProg";
import { SkillMatrix } from "./SkillMatrix";
import { SkillDesc } from "./SkillDesc";

@Entity('skills')
export class Skill
{
    @PrimaryGeneratedColumn()
    skill_id: number;

    @Column({type:'varchar'})
    skill_name: string;

    @Column({type:'int'})
    pos_id: number;

    @Column({type:'tinyint'})
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(()=>Position,(p)=>p.skills)
    @JoinColumn({name:'pos_id'})
    position:Position;

    @OneToMany(()=>Threshold,(rs)=>rs.skill)
    thresholds:Threshold[];

    @OneToMany(()=>SkillProg,(sp)=>sp.skill)
    skill_progs:SkillProg[];

    @OneToMany(()=>SkillMatrix,(sm)=>sm.skill)
    skill_matrix:SkillProg[];

    @OneToMany(()=>SkillDesc,(sd)=>sd.skill)
    skill_descs:SkillDesc[];
}