import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
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
            allowAutoTopicCreation: true,
            // Disable auto-commit to manage acknowledgements manually
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
