import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsDate } from 'class-validator';
import { Timestamp } from 'rxjs';

import { Role } from "src/common/enums/role.enum";

export class UpdateUserDto {
  @ApiProperty({ example: 'Егор', description: 'Имя' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'nice@mail.ru', description: 'Электронная почта' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'ADMIN', description: 'Роль' })
  @IsOptional()
  role: Role;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsOptional()
  password?:string;

  @ApiProperty(({ example: '2025-08-02T12:00:00Z', description: 'Дата обновления' }))
  @IsOptional()
  @IsDate()
  @Type(() => Date) // чтобы преобразовать строку в Date при валидации
  updatedAt?: Date;
}

