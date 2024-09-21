import { Controller, OnModuleInit } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @EventPattern('my-topic')
  async handleKafkaMessage(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const topic = context.getTopic();

    const kafkaMessage = context.getMessage();

    await this.appService.fetchPendingMessages(
      'my-topic',
      'my-kafka-consumer-group',
    );

    const consumer = context.getConsumer();
    const partition = context.getPartition();

    const offset = kafkaMessage.offset;

    try {
      console.log("🎖️🎖️  ⚔️  file: app.controller.ts:29  ⚔️  AppController  ⚔️  kafkaMessage 🎖️🎖️", kafkaMessage)

      await consumer.commitOffsets([
        {
          topic,
          partition: partition,
          offset: offset, // Commit the next offset
        },
      ]);
      console.log(`Offset ${ offset} committed for topic ${topic}`);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
      // Handle the error appropriately (e.g., retry logic, dead letter queue, etc.)
    }
  }
}
