import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ваш сервис Prisma
import { User } from '@prisma/client';
import { UpdateUserDto } from './user-dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<{id: number; mail: string; name: string;role:string} | null> {
    return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      mail: true,
      name: true,
      role:true,
    },
  });
}


  
  async findAll(): Promise<{id: number; mail: string; name: string;role:string}[]> {
    
    return this.prisma.user.findMany({
    select: {
      id: true,
      mail: true,
      name: true,
      role:true,
      
    },
  });
  }
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    // Проверяем, что пользователь существует
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Обновляем пользователя
    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        mail: data.email,
        role:data.role,
        updatedAt: new Date(), 
      },
    });

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
