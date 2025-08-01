import { Body, Controller, Post,Req ,Res, UseGuards,Get} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Request,Response }  from 'express';
import { LoginDto } from "./dto/login.dto";
import { JwtGuard } from "./guard";
@Controller('auth')
export class AuthController{
    constructor(private authService :AuthService) {}

    @Post('register')
    registr(@Body()dto:AuthDto) {
        console.log({
            

        });
        return this.authService.register(dto);
    }

   
    @Post('login')
    async login(@Body() dto: LoginDto) {
    const { user, access_token, refresh_token } = await this.authService.login(dto);
    
    return {
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
    };
}

    @Get('check')
    @UseGuards(JwtGuard)
    check(@Req() req){return {user: req.user}}


    @Post('refresh')
    async refreshTokens(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const { access_token, refresh_token } = await this.authService.refreshTokens(refreshToken);
    return { accessToken: access_token, refreshToken: refresh_token };
    }

    }

