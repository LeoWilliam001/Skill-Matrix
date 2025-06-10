import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";

export class AuthService {
    private empRepo = AppDataSource.getRepository(Employee);

    async loginUser(email: string, pass: string): Promise<Employee | null> {
        const user = await this.empRepo.findOne({ where:{email},
            relations: ['role','hr','team']
         });

        if (!user) {
            console.log("Failed login. User not found");
            return null;
        }

        if (user.password !== pass) {
            console.log("Passwords do not match");
            return null;
        }

        return user;
    }
}