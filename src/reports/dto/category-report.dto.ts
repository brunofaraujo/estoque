import { IsInt } from 'class-validator';

export class CategoryReportDto {
  @IsInt()
  categoryId: number;
}
