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
            clientId: 'my-kafka-producer',
          },
          consumer: {
            groupId: 'my-kafka-consumer-group',

          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
