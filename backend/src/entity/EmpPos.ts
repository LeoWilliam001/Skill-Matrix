import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";
import { Position } from "./Position";

@Entity('employee_position_association')
export class EmpPos
{
    @Column({type:'int'})
    employee_id: number;

    @Column({type:'int'})
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