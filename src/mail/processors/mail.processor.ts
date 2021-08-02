import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../constants';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(
    job: Job<{ emailAddress: string; confirmUrl: string }>,
  ) {
    this._logger.log(
      `Sending confirm registration email to '${job.data.emailAddress}'`,
    );

    try {
      return this._mailerService.sendMail({
        to: job.data.emailAddress,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Registration',
        template: './registration',
        context: { confirmUrl: job.data.confirmUrl },
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.emailAddress}'`,
      );
    }
  }
}
