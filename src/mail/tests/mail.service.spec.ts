import { BullModule, getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { mockedConfigService, mockedJwtService } from 'src/utils/mocks';
import { MAIL_QUEUE } from '../constants';
import { MailService } from '../services';

describe('MailService', () => {
  let service: MailService;
  let moduleRef: TestingModule;

  const exampleQueueMock = { add: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    moduleRef = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: MAIL_QUEUE,
        }),
      ],
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    })
      .overrideProvider(getQueueToken(MAIL_QUEUE))
      .useValue(exampleQueueMock)
      .compile();

    service = moduleRef.get<MailService>(MailService);
  });

  it('should inject the queue', () => {
    const queue = moduleRef.get<Queue>(getQueueToken(MAIL_QUEUE));

    expect(queue).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should dispatch job', async () => {
    await service.sendConfirmationEmail('test@test.com');

    expect(exampleQueueMock.add).toHaveBeenCalledWith('CONFIRM_REGISTRATION', {
      confirmUrl: '7000?token=',
      emailAddress: 'test@test.com',
    });
  });
});
