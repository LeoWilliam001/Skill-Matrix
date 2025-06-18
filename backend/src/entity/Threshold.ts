import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Skill } from "./Skill";
import { Designation } from "./Designation";

@Entity('threshold_values')
export class Threshold {
  @PrimaryGeneratedColumn()
  tv_id: number;

  @Column({type:'int'})
  skill_id: number;

  @Column({type:'int'})
  d_id: number;

  @Column({ type: 'int' })
  threshold_value: number;

  @ManyToOne(() => Skill, skill => skill.thresholds)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => Designation, designation => designation.thresholds)
  @JoinColumn({ name: 'd_id' })
  designation: Designation;
}
