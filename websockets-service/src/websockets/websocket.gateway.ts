import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {
    console.log(`Received message at server side: ${JSON.stringify(payload)}`);

    this.broadcastMessage(
      { key1: 'hi from', key2: 'websocket server' },
      'messageToClient',
    );
  }

  broadcastMessage(message: any, subscription: string) {
    console.log(`Broadcasting message from server: ${JSON.stringify(message)}`);
    this.server.emit(subscription, message);
  }
}
