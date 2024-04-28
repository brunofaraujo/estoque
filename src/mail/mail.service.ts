import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Mail } from './mail.interface';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mailqueue') private readonly mailQueue: Queue) {}

  async sendRequestCode(data: Mail) {
    return await this.mailQueue.add(data);
  }
}
