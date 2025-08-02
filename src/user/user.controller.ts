
import { Controller,Get, UseGuards,Param, ParseIntPipe ,Put,Body,Delete} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UsersService } from './user.service';

import { UpdateUserDto } from './user-dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './user-dto/userResponse.Dto';

@Controller('users')

@UseGuards(JwtGuard,RolesGuard)
export class UserController {
    constructor(private readonly usersService: UsersService ){}
    

    @Roles('ADMIN')
    @Get()
    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({
    status: 200,
    description: 'Список пользователей (пустой массив если пользователей нет); Доступ роль:ADMIN',
    type: [UserResponseDto],
  })
    async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
    }



    @ApiOperation({ summary: 'Получить пользоваетеля по ID' })
    @ApiResponse({
    status: 200,
    description: 'Получить пользоваетеля по ID',
    type: UserResponseDto,
  })
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto  | null> {
    return this.usersService.findOne(id); }


    
    @Roles('ADMIN','USER')
    @Put(':id')
    @ApiOperation({ summary: 'Обновить пользователя по ID' })
    @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлён',
    type: UpdateUserDto,
    })
    @ApiResponse({ status: 404, description: 'Пользователь не найден; Доступ роль:ADMIN' })
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,       // получаем id из URL и преобразуем в число
        @Body() updateUserDto: UpdateUserDto,       // получаем тело запроса с новыми данными пользователя
    ): Promise<UpdateUserDto> {
        return this.usersService.updateUser(id, updateUserDto);  // вызываем сервис для обновления
    }



    @Roles('ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить пользователя по ID' })
    @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удалён; Доступ роль:ADMIN',
    type: UserResponseDto,
    })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async deleteUserById(@Param('id', ParseIntPipe) id: number){
        return this.usersService.deleteUser(id);
    }


    }




