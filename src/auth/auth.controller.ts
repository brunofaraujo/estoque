import { Body, Controller, Get, Headers, Post, Request, UseGuards } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRecoverDto } from "./dto/auth-recover.dto";
import { AuthSignUpDto } from "./dto/auth-create.dto";
import { AuthResetPasswordDto } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

@UseGuards(LocalAuthGuard)
@Post('login')
async login(@Body() body: AuthLoginDto) {
    return await this.authService.login(body);
}

@Post('signup')
async signup(@Body() body: AuthSignUpDto) {
    return await this.authService.register(body);
}

@Post('recover')
async recover(@Body() body: AuthRecoverDto) {
    return await this.authService.recover(body);
}

@Post('reset-password')
async resetPassword(@Body() body: AuthResetPasswordDto) {
    return await this.authService.reset(body);
}

@UseGuards(JwtAuthGuard)
@Post('me')
async postMe(@Request() req) {
   // console.log(req);
    return req.user;
}

@UseGuards(JwtAuthGuard)
@Get('me')
async getMe(@Request() req) {
   return req.user;
}

}