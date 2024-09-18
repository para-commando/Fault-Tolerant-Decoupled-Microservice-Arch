import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit{
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'this.appService.getHello()';
  }

  private client: ClientProxy;

  constructor( @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {


    // Create a TCP client to communicate with the consumer service
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',   // Consumer's host (use appropriate IP)
        port: 3002,          // Port of the consumer service
      },
    })

  }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('my-topic');
    await this.kafkaClient.connect();
  }

  @Post('send-kafka')
  async sendMessage(@Body() message:any) {


    const serializedMessage = JSON.stringify(message);

  // Send the serialized message to the topic
  this.kafkaClient.emit('my-topic', serializedMessage);
  console.log('Message sent to Kafka:', serializedMessage);

  return { message: 'Message sent to kafka topic successfully' };

  }
  // An endpoint that triggers sending a message to the consumer
  @Post('send-redis-stream')
  async sendToConsumer(@Body() message:any): Promise<any> {

    // Send the message to the consumer service
    try {
      const response = await this.client.send('addDataToStream', message).toPromise();

      console.log("🎖️🎖️  ⚔️  file: app.controller.ts:35  ⚔️  AppController  ⚔️  sendToConsumer  ⚔️  response 🎖️🎖️", response)

      return response;  // Response from consumer
    } catch (error) {
      console.error('Error sending message to consumer:', error);
      throw error;
    }
  }
}
