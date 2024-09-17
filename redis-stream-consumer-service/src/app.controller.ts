import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('stream')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('addDataToStream')
  addDataToStream(message: any): string {
    console.log('Received message:', message);
    this.appService.sendToStream(message);
    return `Message received and processed: ${JSON.stringify(message)}`;
  }

  // Endpoint to manually start stream consumption (if you want manual control)
  @MessagePattern('start')
  startConsumingStream(): string {
    this.appService.consumeStream();
    return 'Stream consumption started';
  }

  // Endpoint to manually stop stream consumption (if you implement stopping logic)
  @MessagePattern('stop')
  stopConsumingStream(): string {
    // Implement logic to stop consumption in AppService
    return 'Stream consumption stopped (not yet implemented)';
  }

  // Get the status of the consumer (e.g., last consumed message ID)
  @MessagePattern('status')
  getConsumerStatus() {
    const status = this.appService.getConsumerStatus(); // Assume AppService has this method
    return status;
  }

  // Get the number of pending messages
  @MessagePattern('pending')
  async getPendingMessages() {
    const pendingMessages = await this.appService.getPendingMessages(); // Call a method in AppService
    return pendingMessages;
  }

  // Trigger reprocessing of pending/unacknowledged messages manually
  @MessagePattern('reprocess-pending')
  async reprocessPendingMessages() {
    await this.appService.handleUnacknowledgedMessages();
    return 'Pending messages reprocessed';
  }
}
