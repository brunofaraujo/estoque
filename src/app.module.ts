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
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'mailqueue' }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        encryption: process.env.MAIL_ENCRYPTION,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      template: {
        dir: 'src/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM, //'"SCE - Escola SESI Prata" <brunofadev@gmail.com>',
      },
    }),
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
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
