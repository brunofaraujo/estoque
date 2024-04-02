import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class RequestAmount {

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    itemId: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    amount: number;
}
