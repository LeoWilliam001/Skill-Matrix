import { AppDataSource } from "../data-source";
import { Assessment } from "../entity/Assessment";

export class EvalService{
    private assessmentRepo=AppDataSource.getRepository(Assessment);

    async getAssessment(){
        
    }
}