import { Controller, Get, Param } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('sendApprovalMail')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get('/:requestId')
  sendApprovalMail(@Param('requestId') requestId: string) {
    //this.emailService.sendApprovalMail(requestId);
  }
}
