import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { EmployeesModule } from './employees/employees.module';
import { VolumesModule } from './volumes/volumes.module';
import { ItemsModule } from './items/items.module';
import { SummaryModule } from './summary/summary.module';
import { MovesModule } from './moves/moves.module';
import { ReportsModule } from './reports/reports.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    EmployeesModule,
    VolumesModule,
    ItemsModule,
    SummaryModule,
    MovesModule,
    ReportsModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
