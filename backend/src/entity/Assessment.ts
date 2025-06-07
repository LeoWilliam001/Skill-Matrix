import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({type:'int'})
    status: number;

    @Column({type:'tinyint'})
    is_active: boolean;

    @Column({type:'timestamp'})
    initiated_at:Date;

    @Column({type:'timestamp'})
    updated_at: Date;

    @OneToMany(()=>SkillMatrix,(sm)=>sm.assessment)
    skill_matrix:SkillMatrix[];

    @ManyToOne(()=>Employee,(e)=>e.assessments)
    @JoinColumn({name: 'employee_id'})
    employee: Employee;
}