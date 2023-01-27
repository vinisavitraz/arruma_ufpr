import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { resolve } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as flash from 'connect-flash';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});

  process.title = 'arruma_ufpr';
  process.env.TZ = 'America/Sao_Paulo';

  const { httpAdapter } = app.get(HttpAdapterHost);
  
  hbs.registerPartials(resolve('./dashboard/views/partials'));
  app.useStaticAssets(resolve('./dashboard/public'));
  app.setBaseViewsDir(resolve('./dashboard/views'));
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(3000);
}
bootstrap();
