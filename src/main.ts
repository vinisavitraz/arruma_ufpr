import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { resolve } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as flash from 'connect-flash';
import { formatDate, formatDateTime, select, formatMilliseconds, labelStatusIncident, textStatusIncident, formatInteractionDate, isAdmin, formatIncidentDate, setActiveTab, formatObjectDateTime, buildIncidentsRegistersPerPageUrl, formatRole, formatInteractionColor, isPaginationButtonEnabled, showPendingUserReview, setRatingClass, labelStatusPriority, textStatusPriority, alignInteraction, setInteractionColor, showIncidentImage } from './dashboard/helpers/helpers';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

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

  const config: any = new DocumentBuilder()
    .setTitle('ArrumaUFPR')
    .setDescription('Descrição da API e operações disponíveis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Documentação ArrumaUFPR',
  });

  await app.listen(3000);
}

async function registerHBSHelpers() {
  hbs.registerHelper('format_object_datetime', formatObjectDateTime);
  hbs.registerHelper('format_date', formatDate);
  hbs.registerHelper('format_datetime', formatDateTime);
  hbs.registerHelper('select', select);
  hbs.registerHelper('format_milliseconds', formatMilliseconds);
  hbs.registerHelper('label_status_incident', labelStatusIncident);
  hbs.registerHelper('text_status_incident', textStatusIncident);
  hbs.registerHelper('label_status_priority', labelStatusPriority);
  hbs.registerHelper('text_status_priority', textStatusPriority);
  hbs.registerHelper('format_interaction_date', formatInteractionDate);
  hbs.registerHelper('format_incident_date', formatIncidentDate);
  hbs.registerHelper('is_admin', isAdmin);
  hbs.registerHelper('format_role', formatRole);
  hbs.registerHelper('set_active_tab', setActiveTab);
  hbs.registerHelper('incidents_registers_per_page_url', buildIncidentsRegistersPerPageUrl);
  hbs.registerHelper('format_interaction_color', formatInteractionColor);
  hbs.registerHelper('is_pagination_button_enabled', isPaginationButtonEnabled);
  hbs.registerHelper('show_pending_user_review', showPendingUserReview);
  hbs.registerHelper('set_rating_class', setRatingClass);
  hbs.registerHelper('align_interaction', alignInteraction);
  hbs.registerHelper('set_interaction_color', setInteractionColor);
  hbs.registerHelper('show_incident_image', showIncidentImage);
  
}

bootstrap();
