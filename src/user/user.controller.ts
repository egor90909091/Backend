
import { Controller,Get, UseGuards,Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('users')

@UseGuards(JwtGuard,RolesGuard)
export class UserController {
    
    @Get()
    @Roles('ADMIN')
    getMe(@Req() req: Request){

        return req.user;

    }
}


