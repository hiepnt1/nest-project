import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) { }

export class ChangePwdDto {

    @IsNotEmpty({ message: "email not empty" })
    email: string;

    @IsNotEmpty({ message: "Code not empty" })
    code: string

    @IsNotEmpty({ message: "Pwd not empty" })
    password: string;

    @IsNotEmpty({ message: "confirm Pwd not empty" })
    confirmPassword: string

}