
import { Controller,Get, UseGuards,Param, ParseIntPipe ,Put,Body,Delete} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './user-dto/update-user.dto';

@Controller('users')

@UseGuards(JwtGuard,RolesGuard)
export class UserController {
    constructor(private readonly usersService: UsersService ){}
    

    @Roles('ADMIN')
    @Get()
    async getAllUsers(): Promise<{id: number; mail: string; name: string;role:string}[]> {
    return this.usersService.findAll();
    }

    
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<{id: number; mail: string; name: string; role:string} | null> {
    return this.usersService.findOne(id);

    
    }
    @Roles('ADMIN','USER')
    @Put(':id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,       // получаем id из URL и преобразуем в число
        @Body() updateUserDto: UpdateUserDto,       // получаем тело запроса с новыми данными пользователя
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);  // вызываем сервис для обновления
    }
    @Roles('ADMIN')
    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number){
        return this.usersService.deleteUser(id);
    }


    }




