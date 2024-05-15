import { MailerService } from '@nestjs-modules/mailer';
import {
  Process,
  Processor,
} from '@nestjs/bull';
import { Mail } from './mail.interface';
import { Job } from 'bull';

@Processor('mailqueue')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async sendEmailRequestCode(job: Job<Mail>) {
    const { data } = job;

    await this.mailerService.sendMail({
      ...data,
      subject: '[Código de validação] Solicitação de material',
      template: 'request',
      context: {
        requestCode: data.code,
      },
    });
  }

  // @OnQueueError()
  // onError(job: Job) {
  //   console.error('Queue error!');
  // }

  // @OnQueueCompleted()
  // onCompleted(job: Job) {
  //   console.log('Queue added!');
  // }

  // @OnQueueFailed()
  // onFailed(job: Job) {
  //   console.error('Queue failed.');
  // }
}
