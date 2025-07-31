import { IsEmail, IsIn, IsNotEmpty ,IsString,IsEnum} from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}