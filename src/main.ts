import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,    // strips unknown properties
    forbidNonWhitelisted: true, // throws error if extra properties sent
    transform: true,    // transforms plain objects into DTO classes
  }));
  
  //for exclude password
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Apply Prisma exception filter globally
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  
  //swagger
  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('The social media API description')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth( // Add Bearer token authorization
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token' // This is a unique name for the security scheme
    )
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  // Bind to 0.0.0.0 (important for Docker)
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
