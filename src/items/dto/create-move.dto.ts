import { IsAlpha, IsInt, IsOptional, IsPositive, MaxLength } from "class-validator";

export class CreateMoveDto {

    @IsOptional()
    @IsInt()
    itemId: number;

    @IsOptional()
    @IsInt()
    supplyId: number;

    @IsAlpha()
    @MaxLength(1)
    type: string;

    @IsInt()
    @IsPositive()
    amount: number;

    @IsOptional()
    @IsInt()
    requesterId: number;

    @IsInt()
    userId: number;

}