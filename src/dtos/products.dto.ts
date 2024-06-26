import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateProductDto{
    @IsNotEmpty()
    @IsString()
    @Length(2,40,{message: 'Name must be between $constraint1 and $constraint2 characters long.'})
    public name: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,700,{message: 'Description must be between $constraint1 and $constraint2 characters long.'})
    public description: string;

    @IsNotEmpty()
    @IsString()
    public price: string;

}