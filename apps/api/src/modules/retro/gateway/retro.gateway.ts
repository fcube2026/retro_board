import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export type RetroEventType =
  | 'board.created'
  | 'section.created'
  | 'section.updated'
  | 'section.deleted'
  | 'sections.reordered'
  | 'item.created'
  | 'item.updated'
  | 'item.deleted';

export interface RetroEvent {
  type: RetroEventType;
  boardId?: string;
  payload: unknown;
}

/**
 * Lightweight Socket.IO gateway for near real-time collaboration.
 * Clients join a room named `board:<boardId>` to receive only events
 * relevant to that board. The REST endpoints remain authoritative —
 * sockets are purely a notification channel.
 */
@Injectable()
@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGIN ?? '*').split(',').map((o) => o.trim()),
    credentials: true,
  },
  namespace: '/retro',
})
export class RetroGateway {
  private readonly logger = new Logger(RetroGateway.name);

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { boardId?: string },
    @ConnectedSocket() client: Socket,
  ): { joined: string | null } {
    const boardId = data?.boardId?.trim();
    if (!boardId) return { joined: null };
    const room = roomFor(boardId);
    void client.join(room);
    this.logger.debug(`socket ${client.id} joined ${room}`);
    return { joined: boardId };
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() data: { boardId?: string },
    @ConnectedSocket() client: Socket,
  ): { left: string | null } {
    const boardId = data?.boardId?.trim();
    if (!boardId) return { left: null };
    void client.leave(roomFor(boardId));
    return { left: boardId };
  }

  /** Broadcast a retro event to all sockets watching the given board. */
  emit(event: RetroEvent): void {
    if (!this.server) return;
    if (event.boardId) {
      this.server.to(roomFor(event.boardId)).emit('retro.event', event);
    } else {
      this.server.emit('retro.event', event);
    }
  }
}

function roomFor(boardId: string): string {
  return `board:${boardId}`;
}
