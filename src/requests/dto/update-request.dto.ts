import { PartialType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';
import { IsAlpha, IsInt, IsString, Length } from 'class-validator';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
    
    @IsString()
    @IsAlpha()
    @Length(1)
    status: string;

    @IsInt()
    userId: number;
}
