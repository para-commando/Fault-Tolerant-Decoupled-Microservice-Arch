import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class AppService implements OnModuleInit {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient();
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      console.log('Redis connected successfully!');
      this.consumeStream();
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  }
  // async sendToStream(data: Record<string, string>) {
  //   try {
  //    const asd = await this.redisClient.xAdd('mystream2', '*', data);
  //     console.log('Data sent to Redis stream:', data);
  //     return 'success'
  //   } catch (error) {
  //     console.error('Error sending data to Redis stream:', error);
  //   }
  // }
  async consumeStream() {
    let lastId = '0'; // Start with the first message or from the last acknowledged ID

    while (true) {
      try {
        // Fetch messages from the stream
        const messages = await this.redisClient.xReadGroup(
          'mygroup2',       // Consumer group
          'consumer1',       // Consumer
          [{ key: 'mystream2', id: '>' }],
          { BLOCK: 5000, COUNT: 10 }
        );

        console.log("🎖️🎖️  ⚔️  file: app.service.ts:43  ⚔️  AppService  ⚔️  consumeStream  ⚔️  messages 🎖️🎖️", JSON.stringify(messages))


        // Handle pending messages
        const pending = await this.redisClient.xPending('mystream2', 'mygroup2');
        console.log('Pending messages:', pending);

        if (messages) {
          for (const [stream, messageList] of Object.entries(messages)) {
            for (const message of messageList.messages) {
              // Process the message
              console.log('Consumed message:', message);

              // Acknowledge the message after processing
              if (message && message?.id) {
                const ackResult = await this.redisClient.xAck(
                  'mystream2',
                  'mygroup2',
                  message.id
                );
                console.log(`Message with ID ${message.id} acknowledged:`, ackResult);
              }

              // Update the last ID to start from here in the next read
              lastId = message?.id;
            }
          }
        }
      } catch (error) {
        console.error('Error reading or processing message:', error);

        // Handle unacknowledged messages in case of failure
        await this.handleUnacknowledgedMessages();

        // Optional: Retry logic or reconnect
        await this.reconnectRedis();
      }
    }
  }

  // Handle unacknowledged (pending) messages
  async handleUnacknowledgedMessages() {
    try {
      // Get pending entries for this consumer group
      const pending = await this.redisClient.xPendingRange(
        'mystream2',        // Stream
        'mygroup2',         // Consumer group
        '-', '+',           // Range of message IDs (all pending)
        10                  // Max number of pending messages to return
      );
      console.log('Pending messages:', pending);

      // Claim pending messages that haven't been acknowledged
      for (const pendingMessageObj of pending) {
        const minIdleTimeoutInMilliSeconds = 60000; // 60 seconds
        if (pendingMessageObj?.millisecondsSinceLastDelivery > minIdleTimeoutInMilliSeconds) {
          // Claim if idle for over a minute
          const claimedMessages = await this.redisClient.xClaim(
            'mystream2',
            'mygroup2',
            'consumer1',
            minIdleTimeoutInMilliSeconds,
            pendingMessageObj.id
          );

          for (const claimedMessage of claimedMessages) {
            console.log('Claimed and processing message:', claimedMessage);

            // Reprocess the claimed message
            // (Run your processing logic here)

            // Acknowledge after reprocessing
            await this.redisClient.xAck(
              'mystream2',
              'mygroup2',
              claimedMessage.id
            );
            console.log(`Claimed message with ID ${claimedMessage.id} acknowledged.`);
          }
        }
      }
    } catch (error) {
      console.error('Error handling unacknowledged messages:', error);
    }
  }

  // Optional: Reconnect Redis in case of failure
  async reconnectRedis() {
    try {
      if (!this.redisClient.isOpen) {
        console.log('Reconnecting to Redis...');
        await this.redisClient.connect();
        console.log('Redis reconnected!');
      }
    } catch (error) {
      console.error('Error reconnecting to Redis:', error);
    }
  }

   // Method to return the consumer's status
   async getConsumerStatus(): Promise<string> {
    try {
      // Example of checking Redis connection status
      const isConnected = this.redisClient.isOpen;
      return isConnected ? 'Consumer is connected to Redis' : 'Consumer is not connected to Redis';
    } catch (error) {
      console.error('Error getting consumer status:', error);
      return 'Error getting consumer status';
    }
  }

  // Method to get the pending messages from Redis stream for a consumer group

  async getPendingMessages(): Promise<any> {
    try {
      // Retrieve pending messages from the stream for the group 'mygroup2'
      const pendingMessages = await this.redisClient.xPending(
        'mystream2',     // Redis stream key
        'mygroup2'       // Consumer group name
      );

      if (pendingMessages) {
        return {
             // Total pending messages
          firstPendingId: pendingMessages?.firstId,     // First pending message ID
          lastPendingId: pendingMessages?.lastId,       // Last pending message ID
          consumers: pendingMessages?.consumers,        // Consumer details
        };
      }
      return 'No pending messages found.';
    } catch (error) {
      console.error('Error getting pending messages:', error);
      throw new Error('Failed to retrieve pending messages');
    }
  }
}
