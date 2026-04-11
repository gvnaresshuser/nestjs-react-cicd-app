import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('send')
  send(@Body() body) {
    return this.mailService.sendMail(body.to, body.subject, body.text);
  }
}
