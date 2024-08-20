import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({ message: "Email not empty" })
    email: string;

    @IsNotEmpty({ message: "Password not empty" })
    password: string
}
