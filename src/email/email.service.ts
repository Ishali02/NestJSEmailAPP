import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public example(authCredentialsDto: AuthCredentialsDto): void {
    this.mailerService
      .sendMail({
        to: authCredentialsDto.username, // List of receivers email address
        from: 'testemail.emailapp@gmail.com', // Senders email address
        subject: 'Verification Email', // Subject line
        text: 'welcome', // plaintext body
        html:
          '<b>welcome</b></br><p>Thanks for registration' +
          'Click the below link to verify the email</p><br/><br/>' +
          "<a target='_blank' href='http://localhost:3000/auth/" +
          authCredentialsDto.username +
          "'>Click here </a>", // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
