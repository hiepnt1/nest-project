import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({ message: "Email not empty" })
    email: string;

    @IsNotEmpty({ message: "Password not empty" })
    password: string

    @IsOptional()
    name: string;
}

export class CodeAuthDto {
    @IsNotEmpty({ message: "_id not empty" })
    _id: string;

    @IsNotEmpty({ message: "Code not empty" })
    code: string
}
