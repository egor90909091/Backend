import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService){}


    async signup(dto:AuthDto){

        //генерируем хеш
        const saltRounds=10;
        const salt= await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(dto.password,salt);
        //сохраняем пользователя 
        try {
            const user = await this.prisma.user.create({
            data:{
                mail: dto.mail,
                name: dto.name,
                hash
            },
            
        });
        //возвращаем сохраненного юзера без хэша
        const { hash: _, ...userWithoutHash } = user;
        return userWithoutHash;
        }
        catch (error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code ==='P2002'){
                    throw new ForbiddenException('Credentials taken',);
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
        if (!user) throw new ForbiddenException('Credentials incorrect',);
        //сверяем пароль
        const pwMatches= await bcrypt.compare(dto.password,user.hash);
        // если пароль неправильный выкидываем исключение
        if (!pwMatches) throw new ForbiddenException('Password incorrect');
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }


}

