import "reflect-metadata";
import "reflect-metadata";
import { AppDataSource } from "./data-source"
import dotenv from 'dotenv';
import express from 'express';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import empRoutes from './routes/emp.route';
import skillRoutes from './routes/skill.route';
import evalRoutes from './routes/eval.route';
import cors from 'cors';
import { requestLogger } from "./middleware/logger.middleware";
dotenv.config();

const app=express();
app.use(express.json());
const PORT=process.env.PORT||3001;
app.use(cors({
    origin:"http://localhost:5173"
}));
app.use(requestLogger);

app.use('/api/admin',adminRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/emp',empRoutes);
app.use('/api/skill',skillRoutes);
app.use('/api/eval',evalRoutes);

AppDataSource.initialize().then(() => {
    console.log("App datasource initialized");
    app.listen(PORT,()=> console.log(`${PORT}`));

}).catch(error => console.log(error));
