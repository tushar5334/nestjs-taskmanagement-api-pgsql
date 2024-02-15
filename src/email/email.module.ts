import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    /* MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: Number(2525),
        ignoreTLS: true,
        secure: false,
        auth: {
          user: '3de7319a5bb2a1',
          pass: 'b08eb9c35189b4',
        },
      },
      defaults: {
        from: '"From Name" tushar.patil@tristatetechnology.co.in',
      },
      //preview: true,
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }) */
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('MAIL_HOST'),
            port: Number(configService.get('MAIL_PORT')),
            ignoreTLS: true,
            secure: false,
            auth: {
              user: configService.get('MAIL_USERNAME'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"From Name" <${configService.get('MAIL_FROM_ADDRESS')}>`,
          },
          preview: false,
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      }
    }
    )
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
