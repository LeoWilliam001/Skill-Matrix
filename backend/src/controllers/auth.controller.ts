import {AuthService} from "../services/auth.service";
import {Request,Response} from "express";

const authService=new AuthService();

export const loginUser=async (req:Request,res:Response):Promise<any>=>
{
    try{
        const {email,pass}=req.body;
        console.log(email);
        console.log(pass);
        const logging=await authService.loginUser(email,pass);
        if(!logging)
        {
            console.log("Credentials does not match");
            return res.status(400).json({Invalid: "Credentials does not match"});
        }
        res.status(200).json(logging);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error:"Error occured in the server"});
    }
}