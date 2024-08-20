import { IsNotEmpty, IsMongoId, IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsMongoId({ message: "_id is invalid" })
    @IsNotEmpty({ message: "_id not empty" })
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string
}
