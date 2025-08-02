import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ваш сервис Prisma
import { User } from '@prisma/client';
import { UpdateUserDto } from './user-dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { UserResponseDto } from './user-dto/userResponse.Dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<UserResponseDto | null> {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      mail: true,
      name: true,
      role: true,
    },
  });

  return user
      ? {
          ...user,
          role: user.role as Role, //приводим к типу роль
        }
      : null;
  }

  
  async findAll(): Promise<UserResponseDto[]> {
    
    const users= await this.prisma.user.findMany({
    select: {
      id: true,
      mail: true,
      name: true,
      role:true,
      
    },
  });
  return users.map(user => ({
    id: user.id,
    mail: user.mail,
    name: user.name,
    role: user.role as Role,
  }));
  }


  async updateUser(id: number, data: UpdateUserDto): Promise<UpdateUserDto> {
    // Проверяем, что пользователь существует
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Обновляем пользователя
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        mail: data.email,
        role:data.role,
        updatedAt: new Date(), 
      },
    });
    return {
    
    email: updatedUser.mail,
    name: updatedUser.name,
    role: updatedUser.role as Role,
    updatedAt: updatedUser.updatedAt,
  };
    

  }
   async deleteUser(id: number){
        const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Обновляем пользователя
    return this.prisma.user.delete({where:{
        id:id,
    }
    })
}}
