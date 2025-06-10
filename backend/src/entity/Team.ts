import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity('teams')
export class Team
{
    @PrimaryGeneratedColumn()
    team_id:number;

    @Column({type:'varchar'})
    team_name: string;

    @Column({type: 'int'})
    lead_id:number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=>Employee,(e)=>e.team)
    emp:Employee;

    @ManyToOne(()=>Employee,(e)=>e.teams)
    @JoinColumn({name:'lead_id'})
    employee:Employee;
}