import { error } from "console";
import { SkillService } from "../services/skill.service";
import { Request, Response } from "express";
const skillService=new SkillService()
export const getCriteria=async(req:Request,res:Response)=>{
    try{
        const criteria=await skillService.getCriteria(Number(req.params.id));
        if(!criteria)
        {
            res.status(400).json({error:"Bad request or data not available"});
        }
        res.status(200).json(criteria)
    }
    catch(e)
    {
        console.error(e);
        res.status(500).json({message:"Internal server error"});
    }
}

export const editCriteria=async(req:Request,res:Response)=>{
    try{
        const level_id=req.params.level_id;
        const desc=req.body.desc;
        const criteria=await skillService.editCriteria(Number(level_id),desc);
        if(!criteria)
        {
            res.status(400).json({message:"Bad request from client end"});
        }
        res.status(200).json({message:"Success edition the criteria"});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getAllSkills=async(req:Request,res:Response)=>
{
    try{
        const skills=await skillService.getSkills();
        if(!skills)
        {
            res.status(400).json({error:"Bad request. No skills found"});
        }
        res.status(200).json(skills);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Internal serevr error. Could not return skills"});
    }
}

export const getUpgradeGuide=async(req:Request,res:Response)=>{
    try{
        const guide=await skillService.getGuide(Number(req.params.id));
        if(!guide)
        {
            res.status(400).json({error:"Bad request. Guide not found"});
        }
        res.status(200).json(guide);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Internal Server error"});
    }
}

export const getPositions=async(req:Request,res:Response)=>{
    try{
        const positions=await skillService.getPositions();
        if(!positions)
        {
            res.status(400).json({message:"Bad request in retrieving positions"});
        }
        res.status(200).json(positions);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Internal Server error in getting positions"});
    }
}

export const getSkillMatrixById=async(req:Request,res:Response)=>{
    try{
        const matrices=await skillService.getSkillMatrixById(Number(req.params.id));
        if(!matrices)
        {
            return null;
        }
        res.status(200).json(matrices);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Skill matrix: Internal server error"});
    }
}

export const getRecentSkillMatrixById=async(req:Request,res:Response)=>{
    try{
        const matrices=await skillService.getRecentSkillMatrixById(Number(req.params.id));
        if(matrices==null)
        {
            return null;
        }
        res.status(200).json(matrices);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Recent skill matrix: Internal server error"});
    }
}

export const getSkillMatrixByLead=async(req:Request,res:Response)=>{
    try{
        const assessments=await skillService.getSkillMatrixByLead(Number(req.params.id));
        if(!assessments)
        {
            res.status(400).json({msg:"Maybe some data issues"});
        }
        res.status(200).json(assessments);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"SkillMatrixLead: Internal server error"});
    }
}

export const getDesigTargetById = async (req: Request, res: Response):Promise<any> => {
    try {
      const result = await skillService.getDesigTargetById(Number(req.params.id));
      if(!result)
      {
        res.status(400).json({msg:"Maybe some data issues"});
      }
      res.status(200).json(result);
    } catch (err) {
      console.error("Error fetching designation target:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
