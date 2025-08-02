import { Body, Controller, Post,Req ,Res, UseGuards,Get} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

import { LoginDto } from "./dto/login.dto";
import { JwtGuard } from "./guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TokensDto } from "./dto/tokens.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController{
    constructor(private authService :AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь зарегистрирован и получены токены', type: TokensDto })
    @ApiResponse({ status: 403, description: 'Почта уже используется' })
    async registr(@Body() dto: AuthDto) {
    const { user, accessToken, refreshToken } = await this.authService.register(dto);
    return {
    user,
    accessToken,
    refreshToken,
  };

    }

   
    @Post('login')
    @ApiOperation({ summary: 'Авторизация пользователя ' })
    @ApiOperation({ summary: 'Авторизация пользователя (логин)' })
    @ApiResponse({ status: 200, description: 'Успешный вход', type: AuthResponseDto })
    @ApiResponse({ status: 403, description: 'Неверный email или пароль' })

    async login(@Body() dto: LoginDto) {
    const { user, access_token, refresh_token } = await this.authService.login(dto);
    
    return {
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
    };
}
    @ApiOperation({ summary: 'Проверка действительности JWT токена' })
    @ApiResponse({ status: 200, description: 'Данные текущего пользователя' })
    @ApiResponse({ status: 401, description: 'Токен отсутствует или недействителен' })
    @Get('check')
    @UseGuards(JwtGuard)
    check(@Req() req){return {user: req.user}}


    @ApiOperation({ summary: 'Обновление токенов' })
    @ApiResponse({ status: 200, description: 'Новые токены', type: TokensDto })
    @Post('refresh')
    async refreshTokens(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const { access_token, refresh_token } = await this.authService.refreshTokens(refreshToken);
    return { accessToken: access_token, refreshToken: refresh_token };
    }

    }

