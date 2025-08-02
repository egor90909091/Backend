import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty ,IsString,IsEnum} from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class AuthDto {

    @ApiProperty({ example: 'nice@mail.ru', description: 'Почта' })
    @IsEmail()
    @IsNotEmpty()
    mail: string;


    @ApiProperty({ example: 'password123', description: 'Пароль' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Егор', description: 'Имя' })
    @IsString()
    @IsNotEmpty()
    name: string;
    

    @ApiProperty({ example: 'ADMIN', description: 'Роль' })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}