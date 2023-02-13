import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {
    this.overrideMailAuthenticationDetailsUsingConfiguration();
  }

private async overrideMailAuthenticationDetailsUsingConfiguration(): Promise<void> {
  const email: string = 'arruma.ufpr@gmail.com';
  const emailPassword: string = 'njygarmdnyzxxqom';

  this.mailerService.addTransporter('custom', {
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
        user: email,
        pass: emailPassword,
    },
  });
  }

  public async sendNewAccountMail(
    password: string,
    emailReceiver: string,
  ): Promise<void> {
    const response = await this.mailerService.sendMail({
      transporterName: 'custom',
      to: emailReceiver,
      subject: 'ArrumaUFPR - Ative sua conta',
      template: './new-account',
      context: {
          title: 'Ative sua nova conta ArrumaUFPR',
          password: password,
      },
    });

    if (response.rejected.length > 0) {
      console.log('error sending mail!');
      return;
    }

    return response;
}

}
