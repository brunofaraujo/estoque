import { IsInt } from 'class-validator';

export class ItemReportDto {
  @IsInt()
  itemId: number;
}
