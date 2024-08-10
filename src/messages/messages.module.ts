import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesResolver } from './messages.resolver';

import { Message } from './message.entity';

import { User } from '../users/user.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { ChatRoomsResolver } from 'src/chat-room/chat-rooms.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Message, ChatRoom, User])],
  providers: [MessagesResolver, ChatRoomsResolver],
})
export class MessagesModule {}
