import { IsNotEmpty, IsString } from "class-validator";

export class AddCart{
    @IsNotEmpty()
    @IsString()
    public productId: string;

    @IsNotEmpty()
    @IsString()
    public quantity: string;
}