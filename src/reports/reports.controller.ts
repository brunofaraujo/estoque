import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryReportDto } from './dto/category-report.dto';
import { EmployeeReportDto } from './dto/employee-report.dto';
import { ItemReportDto } from './dto/item-report.dto';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }
  
  @Post('category')
  getCategories(@Body() categoryReport: CategoryReportDto) {
    return this.reportsService.getCategories(categoryReport)
  };

  @Post('employee')
  getEmployee(@Body() employeeReport: EmployeeReportDto) {
    return this.reportsService.getEmployee(employeeReport)
  };

  @Post('item')
  getItem(@Body() itemReport: ItemReportDto) {
    return this.reportsService.getItem(itemReport)
  };


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
  //   return this.reportsService.update(+id, updateReportDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reportsService.remove(+id);
  // }
}
