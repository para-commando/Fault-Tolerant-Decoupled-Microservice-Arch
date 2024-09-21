import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private kafkaAdmin;
  private consumer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'my-consumer-client',
      brokers: ['localhost:9092'],
      connectionTimeout: 5000,

    });
    this.kafkaAdmin = kafka.admin();
    this.consumer = kafka.consumer({
      groupId: 'my-kafka-consumer-group',
      sessionTimeout: 90000,
      heartbeatInterval: 30000,
    });
  }

  async onModuleInit() {
    try {
      await this.kafkaAdmin.connect();
      await this.consumer.connect();

      await this.consumer.subscribe({ topic:'my-topic', fromBeginning: false });
     await this.fetchPendingMessages('my-topic','my-kafka-consumer-group')
    } catch (error) {
      console.error('Error initializing Kafka:', error);
    }
  }

  async onModuleDestroy() {
    try {
      console.log("🎖️🎖️ calling onModuleDestroy !!!!🎖️🎖️")

      await this.consumer.disconnect();
      await this.kafkaAdmin.disconnect();
    } catch (error) {
      console.error('Error disconnecting from Kafka:', error);
    }
  }

  // This method now only fetches pending messages without starting the consumer
  async fetchPendingMessages(topic: string, groupId: string) {
    try {
      // Fetch latest and consumer offsets
      const latestOffsets = await this.kafkaAdmin.fetchTopicOffsets(topic);


      const consumerOffsets = await this.kafkaAdmin.fetchOffsets({ groupId, topics: [topic] });



      const pendingMessages = [];

      for (const partitionOffset of latestOffsets) {
        const partition = partitionOffset.partition;
        const latestOffset = parseInt(partitionOffset.offset, 10);



        const consumerPartitionOffset = consumerOffsets[0].partitions.find(
          (offset) => offset.partition === partition,
        );


        const committedOffset = consumerPartitionOffset
          ? parseInt(consumerPartitionOffset.offset, 10)
          : 0;

        const pending = latestOffset - committedOffset;

        if (pending > 0) {
          // Seek to the committed offset to fetch messages from that point
          await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              console.log(`Fetched message from partition ${partition}, offset ${message.offset}: ${message.value?.toString()}`);
              pendingMessages.push({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
              });
            },
          });

          // Seek to the committed offset
          await this.consumer.seek({ topic, partition, offset: committedOffset.toString() });

          // Wait a bit to ensure messages are processed
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if(pendingMessages.length > 0) {
        for(const pendingMessage of pendingMessages)
        {
         console.log("🎖️🎖️  ⚔️  file: app.service.ts:123  ⚔️  AppService  ⚔️  fetchPendingMessages  ⚔️  pendingMessage 🎖️🎖️", pendingMessage)

           await this.consumer.commitOffsets([
            {
              topic,
              partition: pendingMessage.partition,
              offset: pendingMessage.offset, // Commit the next offset
            },
          ]);
          console.log(`Offset ${ pendingMessage.offset} committed for topic ${topic}`);
        }
      }


    } catch (error) {
      console.error('Error fetching pending messages:', error);
      throw error;
    }
  }
}
