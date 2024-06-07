import { IsInt } from 'class-validator';

export class EmployeeReportDto {
  @IsInt()
  employeeId: number;
}
