import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
import { Assessment } from "./entity/Assessment";
import { Employee } from "./entity/Employee";
import { EmpPos } from "./entity/EmpPos";
import { Position } from "./entity/Position";
import { Role } from "./entity/Role";
import { Skill } from "./entity/Skill";
import { SkillDesc } from "./entity/SkillDesc";
import { SkillMatrix } from "./entity/SkillMatrix";
import { SkillProg } from "./entity/SkillProg";
import { Team } from "./entity/Team";
import { Designation } from "./entity/Designation";
import { Threshold } from "./entity/Threshold";
dotenv.config();
console.log(process.env.MYSQL_PASS);
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.MYSQL_PASS,
    database: "skill_matrix",
    synchronize: true,
    logging: false,
    entities: [Assessment,Employee,EmpPos,Position,Role,Designation,Skill,SkillDesc,SkillMatrix,SkillProg,Team, Threshold],
    migrations: [],
    subscribers: [],
})
