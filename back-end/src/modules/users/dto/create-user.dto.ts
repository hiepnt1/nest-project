import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: "Name is not empty" })
    name: string;

    @IsNotEmpty({ message: "Email is not empty" })
    @IsEmail({}, { message: "Invalid email message" })
    email: string;

    @IsNotEmpty({ message: "Password is not empty" })
    password: string;

    phone?: string;

    address?: string;

    image?: string;

}
