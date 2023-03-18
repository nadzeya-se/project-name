import { IsString } from "class-validator";
import { IsEmail, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()
    email:string

    @MinLength(6,{message:'Password cannot be less than 6 symbols!'})
    @IsString()
    password:string
}