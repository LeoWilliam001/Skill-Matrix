import { Admin } from "typeorm";
import { AdminService } from "../services/admin.service";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const adminService = new AdminService();

//Employee Creation
export const createEmp = async (req: Request, res: Response):Promise<any> => {
    try {
        console.log("Request body:", req.body); 
        const data = req.body;
        const creation = await adminService.createEmp(data); 
        res.status(201).json(creation);
    } catch (err) {
        console.error("Error in createEmp:", err); 
        return res.status(500).json({ message: "Error while creating employee. So employee not created" });
    }
};

//update Employee details
export const updateEmp = async (req: Request, res: Response):Promise<any> => {
    try {
        console.log("Request body:", req.body); 
        const data = req.body;
        const updation = await adminService.updateEmp(data); 
        res.status(201).json(updation);
    } catch (err) {
        console.error("Error in updateEmp:", err); 
        return res.status(500).json({ message: "Error while updating employee. So employee not updated" });
    }
};

//View all employees
export const viewAll=async(req:Request,res: Response)=>{
    try{
        const emp=await adminService.viewAllEmp();
        res.status(201).json(emp);
    }
    catch(err)
    {
        console.error("Server issue");
        res.status(500).json({message:"Employees cannot be retrieved"});
    }
}

//View employee by team id
export const viewTeamById=async(req:Request,res:Response)=>{
    try{
        const emp=await adminService.viewEmpByTeam(Number(req.params.id));
        res.status(201).json(emp);
    }
    catch(err)
    {
        console.error("Server issue");
        res.status(500).json({message:"Employees by team cannot be retrieved"});
    }
}

//Initiate assessments
export const startAssessment=async(req:Request,res:Response)=>{
    try{
        const {q_id,year,status}=req.body;
        const assessment=await adminService.initiateAssessment(q_id,year,status);
        if(!assessment)
        {
            res.status(400).json({message:"Very bad request"});
        }
        res.status(201).json({message:"Creation was successful"});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getRoles = async (req: Request, res: Response):Promise<any> => {
  try {
    const roles = await adminService.getRoles();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: 'No roles found' });
    }
    res.json(roles);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHrs = async (req: Request, res: Response):Promise<any> => {
  try {
    const hrs = await adminService.getHrs();
    if (!hrs || hrs.length === 0) {
      return res.status(404).json({ message: 'No HRs found' });
    }
    res.json(hrs);
  } catch (err) {
    console.error("Error fetching HRs:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPositions = async (req: Request, res: Response):Promise<any> => {
  try {
    const positions = await adminService.getPositions();
    if (!positions || positions.length === 0) {
      return res.status(404).json({ message: 'No positions found' });
    }
    res.json(positions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeams = async (req: Request, res: Response):Promise<any> => {
  try {
    const teams = await adminService.getTeams();
    if (!teams || teams.length === 0) {
      return res.status(404).json({ message: 'No teams found' });
    }
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
