import { EmpService } from "../services/emp.service";
import {Request,Response} from 'express';

const empService = new EmpService();

export const getTeamMatrix=async(req:Request,res:Response)=>{
    try{
        const id =req.params.id;
        const teamMatrix=await empService.viewmyTeamMatrix(Number(id));
        if(!teamMatrix)
        {
            res.status(400).json({message: "No team skill matrix data is avaialable"});
        }
        res.status(200).json(teamMatrix);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getMatrixById=async(req:Request,res:Response)=>{
    try{
        const id =req.params.id;
        const myMatrix=await empService.viewMatrixById(Number(id));
        if(!myMatrix)
        {
            res.status(400).json({message: "No skill matrix data is avaialable"});
        }
        res.status(200).json(myMatrix);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
}

export const empRates=async(req:Request, res:Response)=>{
    try{
        const data=req.body;
        const rate=await empService.empRates(data);
        if(!rate)
        {
            res.status(400).json({msg:"Issue is likely in the frontend"});
        }
        res.status(201).json({msg:"Employee rating was successful"});
    }
    catch(err)
    {
        console.error("The error is : "+err);
    }
}

export const leadRates=async(req:Request, res:Response)=>{
    try{
        const id=req.body.assess_id;
        const comments=req.body.comments;
        const data=req.body.data;
        const rate=await empService.leadRates(id, comments, data);
        if(!rate)
        {
            res.status(400).json({msg:"Issue is likely in the frontend"});
        }
        res.status(201).json({msg:"Lead rating to employee was successful"});
    }
    catch(err)
    {
        console.error("The error is : "+err);
    }
}