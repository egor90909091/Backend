import { Body, Controller, Post,Req ,Res} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

import { Request,Response }  from 'express';
@Controller('auth')
export class AuthController{
    constructor(private authService :AuthService) {}

    @Post('registr')
    registr(@Body()dto:AuthDto) {
        console.log({
            

        });
        return this.authService.register(dto);
    }

    @Post('signin')
    signin(@Body()dto:AuthDto){
        return this.authService.signin(dto);
    }

    @Post('refresh-tokens')
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log(req.cookies)
        const refreshToken = req.cookies['refresh_token'];
        const { access_token, refresh_token } = await this.authService.refreshTokens(refreshToken);


        // Сохраняем новый refresh token в куку на 7 дней
        res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: '/auth/refresh-tokens',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token }
    }
    }

