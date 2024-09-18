import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService {
  private kafkaAdmin;
  private consumer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'my-consumer-client',
      brokers: ['localhost:9092'],
    });
    this.kafkaAdmin = kafka.admin();
    this.consumer = kafka.consumer({ groupId: 'my-kafka-consumer-group',sessionTimeout: 90000, // large enough to fit any message being processed
      heartbeatInterval: 30000  });
  }

  // Method to get all pending messages along with their offsets and partition details
  async fetchPendingMessages(topic: string, groupId: string) {
    await this.kafkaAdmin.connect();
    await this.consumer.connect();
  //  await this.consumer.subscribe({ topic: topic, fromBeginning: false });

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
        await this.consumer.subscribe({ topic, fromBeginning: false });
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

    // Disconnect from Kafka services
    await this.consumer.disconnect();
    await this.kafkaAdmin.disconnect();

    return pendingMessages;
  }
}
