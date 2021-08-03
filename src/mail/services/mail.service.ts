import { Injectable, Logger } from '@nestjs/common';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue) {}

  public async sendConfirmationEmail(
    emailAddress: string,
    confirmUrl: string,
  ): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, {
        emailAddress,
        confirmUrl,
      });
    } catch (error) {
      this._logger.error(
        `Error queueing registration email to user ${emailAddress}`,
      );

      throw error;
    }
  }
}
