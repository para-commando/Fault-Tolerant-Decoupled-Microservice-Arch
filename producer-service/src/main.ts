import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bufferLogs: true,
  });


  app.enableCors();

  await app.listen(3001);
  console.log('🎖️🎖️  ⚔️  Producer Microservice is listening on port 3001 ⚔️ 🎖️🎖️');
}
bootstrap();
