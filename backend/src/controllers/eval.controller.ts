import { EvalService } from "../services/eval.service";
import { Request,Response } from "express";
const evalService=new EvalService();

export const getAssessmentbyId=async(req:Request, res:Response)=>{
  try{
    const assessments=await evalService.getAssessmentbyId(Number(req.params.id));
    if(!assessments)
    {
      return;
    }
    res.status(200).json(assessments);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:"Assessment: Internal server error"});
  }
}

export const getAssessmentbyRoles=async(req:Request,res:Response)=>{
  try{
    const {role_name,team_id}=req.body;
    const assessments=await evalService.getAssessmentbyRole(Number(req.params.id),role_name);
    if(!assessments)
    {
      return null;
    }
    res.status(200).json(assessments);
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({error:"AssessmentbyRole: Internal server error"});
  }
}

export const submitAssessbyRole=async(req:Request,res:Response)=>{
  try{
    const data=req.body;
    const rate=await evalService.submitAssessbyRole(Number(req.params.id),data);
    if(!rate)
    {
      res.status(400).json({msg:"Issue is likely in sending req"});
    }
    res.status(201).json({msg:"Employee rating was successful"});
  }
  catch(err)
  {
    res.status(500).json({error:"SubmitAssessment:Internal server error"});
  }
}

export const hrApprovalbyAssess=async(req:Request,res:Response)=>{
  try{
    const approve=await evalService.hrApprovalbyAssess(Number(req.params.id),req.body.comments);
    if(!approve)
    {
      res.status(400).json({msg:"Cannot be approved sorry"});
    }
    res.status(200).json(approve);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:"HR Approval: Internal server error"});
  }
}

export const getMatricesByAssess=async(req:Request,res:Response)=>{
  try{
    const matrices=await evalService.getMatrixByAssess(Number(req.params.id));
    if(matrices.length<=0)
    {
      res.status(400).json({message:"No metrices found"});
    }
    res.status(200).json(matrices);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:"SkillMatrix:Internal server error"});
  }
}
