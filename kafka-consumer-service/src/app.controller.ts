import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController  {
  constructor(private readonly appService: AppService) {}
  @EventPattern('my-topic')
  // async handleKafkaMessage(data: any) {
  //   console.log('Received message from Kafka:', data);
  //    console.log('Received message from Kafka:211111111111111111', JSON.stringify(data, null, 2));
  //   // Handle the message from the producer
  // }

  async handleKafkaMessage(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const topic = context.getTopic();
   // const kafkaMessage = context.getMessage();
    const allPendingMessages = await this.appService.fetchPendingMessages(topic,'my-kafka-consumer-group');
    const consumer = context.getConsumer();
    // const partition = context.getPartition();
    // const offset = kafkaMessage.offset;

    try {
      // Process the message here
      console.log(`Received message: ${JSON.stringify(message)}`);
      if(allPendingMessages.length > 0) {
        for(const pendingMessage of allPendingMessages)
        {
           await consumer.commitOffsets([
            {
              topic,
              partition: pendingMessage.partition,
              offset: pendingMessage.offset, // Commit the next offset
            },
          ]);
          console.log(`Offset ${ pendingMessage.offset} committed for topic ${topic}`);
        }
      }
      // Acknowledge (commit) the message manually after successful processing
       

    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
      // Handle the error appropriately (e.g., retry logic, dead letter queue, etc.)
    }
  }


}
