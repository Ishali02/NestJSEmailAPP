import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'testemail.emailapp@gmail.com', // generated ethereal user
          pass: 'EmailApp@123', // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" <testemail.emailapp@gmail.com>', // outgoing email ID
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [MailerModule],
})
export class EmailModule {}
