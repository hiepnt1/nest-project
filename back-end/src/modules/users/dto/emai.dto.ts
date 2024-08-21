import { IsEmail } from "class-validator";

export class CreateEmailDto {
    @IsEmail()
    email: string;
}