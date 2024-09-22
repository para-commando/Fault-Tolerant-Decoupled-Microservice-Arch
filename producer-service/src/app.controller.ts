import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import {
  ClientKafka,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RedisClientType, createClient } from 'redis';
import { io, Socket } from 'socket.io-client';

@Controller()
export class AppController implements OnModuleInit {
  // constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return 'this.appService.getHello()';
  }

  private client: ClientProxy;
  private redisClient: RedisClientType;
  private socket: Socket;

  constructor(
     @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,

   ) {
    this.redisClient = createClient({
      // url: 'redis://:password@localhost:6379', // if password is required
      url: 'redis://localhost:6379',
    });
    // Create a TCP client to communicate with the consumer service
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1', // Consumer's host (use appropriate IP)
        port: 3002, // Port of the consumer service
      },
    });
    this.socket = io('http://localhost:3009');

    this.listenFromWebSocketServerMessages();

  }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('my-topic');
    await this.redisClient.connect();
    console.log('Redis connected successfully!');
  }

  @Post('send-kafka')
  async sendMessage(@Body() message: any) {
    const serializedMessage = JSON.stringify(message);

    // Send the serialized message to the topic
    this.kafkaClient.emit('my-topic', serializedMessage);
    console.log(
      'Message sent by producer to Kafka topic: my-topic, value: ',
      serializedMessage,
    );

    return { message: 'Message sent by producer to Kafka topic: my-topic' };
  }
  // An endpoint that triggers sending a message to the consumer
  @Post('send-redis-stream')
  async sendToConsumer(@Body() message: any): Promise<any> {
    // Send the message to the consumer service
    try {
      await this.redisClient.xAdd('mystream2', '*', message);
      console.log('Data sent to Redis stream:', message);
      return 'success';
    } catch (error) {
      console.error('Error sending data to Redis stream:', error);
    }
  }

    // An endpoint that triggers sending a message to the websocket server
    @Post('send-websocket-messages')
    async sendToWebSocketClient(@Body() message: any): Promise<any> {
      // Send the message to the consumer service
      try {
        console.log(`Broadcasting message from client: ${JSON.stringify(message)}`);
        this.socket.emit('messageToServer', message);

        return {message:'payload sent to websocket server successfully'};
      } catch (error) {
        console.error('Error sending data to Redis stream:', error);
      }
    }
  listenFromWebSocketServerMessages() {
    this.socket.on('messageToClient', (data) => {
      console.log('Received message from WebSocket server:', JSON.stringify(data));
    });
  }
}
