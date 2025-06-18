import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Employee } from "./Employee";
import { Threshold } from "./Threshold";

@Entity('designation')
export class Designation {
  @PrimaryGeneratedColumn()
  d_id: number;

  @Column({ type: 'varchar' })
  desig_name: string; 

  @OneToMany(() => Employee, employee => employee.designation)
  employees: Employee[];

  @OneToMany(() => Threshold, threshold => threshold.designation)
  thresholds: Threshold[];
}
