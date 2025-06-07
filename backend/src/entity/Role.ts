import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity('roles')
export class Role
{
    @PrimaryGeneratedColumn()
    role_id: number;

    @Column({type:'varchar'})
    role_name: string;
    
    @OneToMany(()=>Employee,(e)=>e.role)
    emp:Employee;
}