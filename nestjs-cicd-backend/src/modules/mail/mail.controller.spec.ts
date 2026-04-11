import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-value'),
          },
        },
      ],
      controllers: [MailController],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
