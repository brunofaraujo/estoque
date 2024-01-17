import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  serial: string;

  @IsOptional()
  @IsDateString()
  expiration: string | Date;

  @IsOptional()
  batch: string;

  @IsInt()
  volumeId: number;

  @IsInt()
  brandId: number;

  @IsInt()
  categoryId: number;

  @IsInt()
  amount: number;
}
