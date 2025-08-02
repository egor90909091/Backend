import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nice@mail.ru', description: 'Почта' })
  @IsEmail()
  @IsNotEmpty()
  mail: string;


  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;
}


   