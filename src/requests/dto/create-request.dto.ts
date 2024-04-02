import { ArrayNotEmpty, IsInt, IsString, MaxLength, ValidateNested } from "class-validator";
import { RequestAmount } from "../entities/request-amount.entity";
import { Type } from "class-transformer";

export class CreateRequestDto {
    
    @IsString()
    @MaxLength(255)
    description: string;

    @IsInt()
    employeeId: number;

    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => RequestAmount)
    requestAmounts: RequestAmount[]
}