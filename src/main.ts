import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { resolve } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as flash from 'connect-flash';
import { formatDate, formatDateTime, select, formatMilliseconds } from './dashboard/helpers/helpers';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});

  process.title = 'arruma_ufpr';
  process.env.TZ = 'America/Sao_Paulo';

  const { httpAdapter } = app.get(HttpAdapterHost);
  
  app.useGlobalPipes(new ValidationPipe());
  hbs.registerPartials(resolve('./dashboard/views/partials'));
  app.useStaticAssets(resolve('./dashboard/public'));
  app.setBaseViewsDir(resolve('./dashboard/views'));
  await registerHBSHelpers();
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

async function registerHBSHelpers() {
  hbs.registerHelper('format_date', formatDate);
  hbs.registerHelper('format_datetime', formatDateTime);
  hbs.registerHelper('select', select);
  hbs.registerHelper('format_milliseconds', formatMilliseconds);
}

bootstrap();
