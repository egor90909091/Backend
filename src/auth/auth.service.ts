import { ForbiddenException, Injectable,UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Role } from "src/common/enums/role.enum";



@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService, private jwt: JwtService, private config: ConfigService){}


    async register(dto:AuthDto){

        //генерируем хеш
        const saltRounds=10;
        //генерируем соль
        const salt= await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(dto.password,salt);
        //сохраняем пользователя 
        try {
            const user = await this.prisma.user.create({
            data:{
                mail: dto.mail,
                name: dto.name,
                hash,
                role:dto.role
                
            },
            
        });
        //возвращаем сохраненного юзера без хэша
        return this.signToken(user.id,user.mail, user.role );
        }
        catch (error){
            if (error instanceof PrismaClientKnownRequestError){
                
                if (error.code ==='P2002'){
                    throw new ForbiddenException('Mail must be unique',);
                }
            }
            throw error;
        }
        
    }

    async signin(dto:AuthDto){
        //находим пользователя по мейлу
        
        const user = await this.prisma.user.findUnique({
            where:{
                mail: dto.mail,
            },
        });
        // если нет выкидываем исключение
        if (!user) throw new ForbiddenException('User does not exist',);
        //сверяем пароль
        const pwMatches= await bcrypt.compare(dto.password,user.hash);
        // если пароль неправильный выкидываем исключение
        if (!pwMatches) throw new ForbiddenException('Password incorrect');
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;

    }
    //функция выдачи токена 
    async signToken(
        userId:number,
        email:string,
        role:string
    ):Promise<{
        access_token: string,
        refresh_token: string }>
        {
        const payload={
            sub: userId,
            email,
            role,
        }

        const accessSecret=this.config.get("JWT_SECRET")
        const refreshSecret=this.config.get("JWT_SECRET_REFRESH")

        const accessToken = await this.jwt.signAsync(payload,
            {
            expiresIn:'60m',
            secret: accessSecret,
        },
        );
        const refreshToken = await this.jwt.signAsync(payload,{
            expiresIn:'7d',
            secret: refreshSecret
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }


    async refreshTokens(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token отсутствует');
    try {
        
        //проверяем токен
        const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_SECRET_REFRESH'),
        });
        
      
      
      // Ротация: Генерируем новые токены
      const tokens = await this.signToken(payload.sub, payload.email,payload.role);
      

      return { userId: payload.sub, email: payload.email,role: payload.role , ...tokens };
    } 
    catch (err) 
    {
        
      throw new UnauthorizedException('Невалидный или истёкший refresh token');
    }
  }
}



