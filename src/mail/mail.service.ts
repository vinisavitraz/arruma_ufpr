import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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

  public async sendCreatePasswordMail(
    host: string,
    token: string,
    emailReceiver: string,
  ): Promise<void> {
    const recoverPasswordLink: string = host + '/dashboard/reset-password?token=' + token;

    const response = await this.mailerService.sendMail({
      transporterName: 'custom',
      to: emailReceiver,
      subject: 'ArrumaUFPR - Criar nova senha',
      template: './reset-password',
      context: {
          title: 'Novo por aqui? Configure sua nova senha!',
          recoverPasswordLink: recoverPasswordLink,
          description: 'Clique no botão abaixo para configurar sua nova senha.',
      },
    });

    if (response.rejected.length > 0) {
      console.log('error sending mail!');
      return;
    }

    return response;
  }

  public async sendResetPasswordMail(
    host: string,
    token: string,
    emailReceiver: string,
  ): Promise<void> {
    const recoverPasswordLink: string = host + '/dashboard/reset-password?token=' + token;

    const response = await this.mailerService.sendMail({
      transporterName: 'custom',
      to: emailReceiver,
      subject: 'ArrumaUFPR - Recuperação de senha',
      template: './reset-password',
      context: {
          title: 'Esqueceu sua senha? Não tem problema!',
          recoverPasswordLink: recoverPasswordLink,
          description: 'Clique no botão abaixo para recuperar a senha da sua conta ArrumaUFPR. Se você não fez essa solicitação, por favor ignore esse email.',
      },
    });

    if (response.rejected.length > 0) {
      console.log('error sending mail!');
      return;
    }

    return response;
  }

}
