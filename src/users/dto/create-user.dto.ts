import { IsEmail, IsNumberString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNumberString()
    @Length(5)
    @MaxLength(5)
    username: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(15)
    password: string;
}
