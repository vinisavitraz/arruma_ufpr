import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {
    this.overrideMailAuthenticationDetailsUsingConfiguration();
  }

private async overrideMailAuthenticationDetailsUsingConfiguration(): Promise<void> {
  const email: string = 'arruma.ufpr@gmail.com';
  const emailPassword: string = 'vsjrkrauoxfzkloq';

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

  public async sendCreatePasswordMail(
    host: string,
    token: string,
    emailReceiver: string,
  ): Promise<void> {

    return await this.sendMail(
      emailReceiver,
      'ArrumaUFPR - Criar nova senha',
      './reset-password',
      {
        title: 'Novo por aqui? Configure sua nova senha!',
        recoverPasswordLink: host + '/dashboard/reset-password?token=' + token,
        description: 'Clique no botão abaixo para configurar sua nova senha.',
      },
    );
  }

  public async sendResetPasswordMail(
    host: string,
    token: string,
    emailReceiver: string,
  ): Promise<void> {

    return await this.sendMail(
      emailReceiver,
      'ArrumaUFPR - Recuperação de senha',
      './reset-password',
      {
        title: 'Esqueceu sua senha? Não tem problema!',
        recoverPasswordLink: host + '/dashboard/reset-password?token=' + token,
        description: 'Clique no botão abaixo para recuperar a senha da sua conta ArrumaUFPR. Se você não fez essa solicitação, por favor ignore esse email.',
      },
    );
  }

  private async sendMail(
    emailReceiver: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<SentMessageInfo | null> {
    const response: SentMessageInfo = await this.mailerService.sendMail({
      transporterName: 'custom',
      to: emailReceiver,
      subject: subject,
      template: template,
      context: context,
    });

    if (response.rejected.length > 0) {
      console.log('error sending mail!');
      return;
    }

    return response;
  }

}
