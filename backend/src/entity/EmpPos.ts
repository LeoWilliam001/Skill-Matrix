import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Employee } from "./Employee";
import { Position } from "./Position";

@Entity('employee_position_association')
export class EmpPos
{
    @PrimaryColumn({type:'int'})
    employee_id: number;

    @PrimaryColumn({type:'int'})
    pos_id: number;

    @Column({type:'tinyint'})
    is_primary: boolean;

    @ManyToOne(()=>Employee,(e)=>e.emp_pos)
    @JoinColumn({name:'employee_id'})
    employee:Employee;

    @ManyToOne(()=>Position,(p)=>p.emp_pos)
    @JoinColumn({name:'pos_id'})
    position: Position;
}