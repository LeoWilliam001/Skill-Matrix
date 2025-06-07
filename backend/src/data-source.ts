import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
dotenv.config();
console.log(process.env.MYSQL_PASS);
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.MYSQL_PASS,
    database: "",
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
})
