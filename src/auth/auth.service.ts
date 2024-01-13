import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRecoverDto } from './dto/auth-recover.dto';
import { AuthResetPasswordDto } from './dto/auth-reset.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
        ) {}

    async generateTokenLogin(user: User) {
        return {accessToken: await this.jwtService.sign({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email
        },{
            issuer: 'login',
            audience: 'users',
            subject: String(user.id)
        })
    }
    }   
    
    async validateToken(token: string) {

        try {
            const data = this.jwtService.verify(token);
            return data;
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    // async validateUser(username: string,  password: string) {
    //     const user = await this.usersService.findOne(null, username);
    //     if (user && user.password === password) {
    //         const {password, ...result} = user; // Separates password information from remaining data
    //         return result;
    //     }
    //     return null;
    // }

    async login(authLoginDto: AuthLoginDto) {

        try {
            const user = await this.prisma.user.findFirstOrThrow({
                where: {
                    username: authLoginDto.username,
                    password: authLoginDto.password
                }
            })  
            return this.generateTokenLogin(user)  
        } catch (error) {
            throw new UnauthorizedException(error)
        }
        
        // const payload = { username: user.username, sub: user.userId};
        // return {
        //     access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET })
        // }
    }

    async recover(authRecoverDto: AuthRecoverDto) {

        //TODO: Should not return the user but send email instead.
        return await this.prisma.user.findFirstOrThrow({
            where: {email: authRecoverDto.email}
        })
    }

    async reset(authResetPasswordDto: AuthResetPasswordDto) {
        //TODO: Validate token
        // Extract userId from token
        // use prisma to update user passing id and the new password

        const id = 0; // Mockup!

        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                password: authResetPasswordDto.password
            }
        })

        return this.generateTokenLogin(user);

    }

    async register(registerUserDto: CreateUserDto) {
        try {

            const user = await this.prisma.user.create({
                data: registerUserDto
            })
            return this.generateTokenLogin(user);
            
        } catch (error) {
            throw new BadRequestException(error);
        }

    }

}

