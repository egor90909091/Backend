import { Injectable ,NotFoundException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt'){
    constructor(
        config:ConfigService,
        private prisma: PrismaService
    )
    {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
        throw new Error('JWT_SECRET must be defined');
        }
        super (
            {
            //passport-jwt проверяет exp если исетк то выбрасывает UnauthorizedException
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }
    async validate(payload:{
        sub: number;
        mail:string;
        role:string;
        
    })
        {
            const user = await this.prisma.user.findUnique({
                where:{
                    id: payload.sub,
                },
            });
            if (!user) {
            throw new NotFoundException('User was not found');
           }

            const { hash, ...result } = user; //  исключаем hash
            return result;
        
    };
    
    
}