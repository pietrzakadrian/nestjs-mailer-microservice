import { Injectable, Logger } from '@nestjs/common';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  public async sendConfirmationEmail(emailAddress: string): Promise<void> {
    const confirmUrl = this._getConfirmUrl(emailAddress);

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

  private _getConfirmUrl(emailAddress: string): string {
    const token = this._getJwtConfirmToken(emailAddress);

    return `${this._configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
  }

  private _getJwtConfirmToken(emailAddress: string): string {
    return this._jwtService.sign({ emailAddress });
  }
}
