import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { Request } from '../request/request.entity';

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
          "<a target='_blank' href='http://localhost:3001/auth/" +
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

  public sendApprovalMail(data: Request): void {
    this.mailerService
      .sendMail({
        to: data.manager['username'], // List of receivers email address
        from: 'testemail.emailapp@gmail.com', // Senders email address
        subject: 'Software Approval Email', // Subject line
        text: 'welcome', // plaintext body
        html:
          '<p>Hi ' +
          data.manager['fullName'] +
          ',</p><br>' +
          "<p><a href='mailto:" +
          data.user['username'] +
          "'>" +
          data.user['fullName'] +
          '</a> is requesting approval for <b>' +
          data.requestId +
          '</b>.</p>' +
          '<p>Software : ' +
          data.sw['swName'] +
          '</p>' +
          '<p>Request Date : ' +
          data.reqDate +
          '</p><br>' +
          '<p>Approvers:<br>' +
          "		<i><b>Manager: <a href='mailto:" +
          data.manager['username'] +
          "'>" +
          data.manager['fullName'] +
          '</a></b></i><br>' +
          "		IT Team: <a href='mailto:" +
          data.itTeam['username'] +
          "'>" +
          data.itTeam['fullName'] +
          '</a><br>' +
          "		Software Team: <a href='mailto:" +
          data.softwareTeam['username'] +
          "'>" +
          data.softwareTeam['fullName'] +
          '</a></p><br><br>' +
          "<a target='_blank' style='text-decoration: none; background:#5cb85c; color:white; padding: 10px;' href='http://localhost:8080/emailAppWS/request/sendApprovalMail/" +
          data.requestId +
          "-m'>Approve</a>" +
          "<a target='_blank' style='text-decoration: none; background:#d9534f; color:white; padding: 10px; margin-left: 30px;' href='http://localhost:8080/emailAppWS/request/sendApprovalMail/" +
          data.requestId +
          "-m-1'>Reject</a>" +
          '<br><br>' +
          '<p>Regards,</p>' +
          '<p><i>Email App Team</i></p>',
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
