import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";


export class AuthService{
    private empRepo=AppDataSource.getRepository(Employee);

    async loginUser(email:string,pass:string):Promise<Employee|null>{
        const emp:Employee=await this.empRepo.findOneBy({
            email:email
        })
        if(!emp)
        {
            console.log("Failed login. User not found");
            return;
        }
        if(emp.password!==pass)
        {
            console.log("Passwords does not match");
            return;
        }
        return emp;
    }
}