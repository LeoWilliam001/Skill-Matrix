import "reflect-metadata";
import { AppDataSource } from "./data-source"
import dotenv from 'dotenv';
import express from 'express';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
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
AppDataSource.initialize().then(() => {
    console.log("App datasource initialized");
    app.listen(PORT,()=> console.log(`${PORT}`));

}).catch(error => console.log(error))
