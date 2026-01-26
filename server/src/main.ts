import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
    app.enableCors({
      origin: true, 
      credentials: true, 
    });

  const config = new DocumentBuilder()
    .setTitle('Bike Rental')
    .setDescription('The Bike Rental API description')
    .setVersion('1.0')

    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Enter JWT token **with `Bearer ` prefix**',
    //     in: 'header',
    //   },
    //   'access-token',
    // )

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
