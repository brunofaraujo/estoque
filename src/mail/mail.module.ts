import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'mailqueue' }), MailerModule],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
