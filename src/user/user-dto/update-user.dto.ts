import { IsOptional, IsString, IsEmail } from 'class-validator';
import { Timestamp } from 'rxjs';
import { Role } from "src/common/enums/role.enum";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  role: Role;

  @IsOptional()
  password:string;
}
