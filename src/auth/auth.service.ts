import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRecoverDto } from './dto/auth-recover.dto';
import { AuthResetPasswordDto } from './dto/auth-reset.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UsersService
        ) {}


    async validateUser(username: string, password: string) {        
        try {
            const user = await this.userService.findByUsername(username);
            if (user && await bcrypt.compare(password, user.password)) {
                return user;    
            }            
            
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }

    async login(authLoginDto: AuthLoginDto) {
        const { username } = authLoginDto;
        const user = await this.userService.findByUsername(username)
        return this.generateTokenLogin(user)
    }

    async generateTokenLogin(user: User) {
        return {accessToken: this.jwtService.sign({
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

    hashPassword(password: string) {
        return bcrypt.hash(password, 10); // 10 rounds as default
    }

    async register(registerUserDto: CreateUserDto) {
        try {

            registerUserDto.password = await this.hashPassword(registerUserDto.password)

            const user = await this.prisma.user.create({
                data: registerUserDto
            })
            return this.generateTokenLogin(user);
            
        } catch (error) {
            throw new BadRequestException(error);
        }

    }

}

