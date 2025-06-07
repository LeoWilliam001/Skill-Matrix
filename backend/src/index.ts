import { AppDataSource } from "./data-source"
import * as dotenv from 'dotenv';

dotenv.config();
AppDataSource.initialize().then(async () => {


}).catch(error => console.log(error))
