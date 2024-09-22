import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

}
