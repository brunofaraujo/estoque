import { IsEmail } from "class-validator";

export class AuthRecoverDto {

    @IsEmail()
    email: string

}