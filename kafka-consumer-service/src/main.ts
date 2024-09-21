import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'my-consumer-client',
        },
        consumer: {
          groupId: 'my-kafka-consumer-group',
          sessionTimeout: 90000, // large enough to fit any message being processed
          heartbeatInterval: 30000,
        },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('🎖️🎖️ Kafka consumer microservice is listening 🎖️🎖️');
}
bootstrap();
