import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../users/user.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => ChatRoom)
export class ChatRoomsResolver {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Query(() => [ChatRoom])
  async chatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomsRepository.find({ relations: ['participants'] });
  }

  @Mutation(() => ChatRoom)
  async createChatRoom(
    @Args('name') name: string,
    @Args('participantIds', { type: () => [Number] }) participantIds: number[],
  ): Promise<ChatRoom> {
    const participants = await this.usersRepository.findByIds(participantIds);
    const chatRoom = this.chatRoomsRepository.create({ name, participants });
    await this.chatRoomsRepository.save(chatRoom);
    pubSub.publish('chatRoomCreated', { chatRoomCreated: chatRoom });
    return chatRoom;
  }

  @Subscription(() => ChatRoom)
  chatRoomCreated() {
    return pubSub.asyncIterator('chatRoomCreated');
  }
}
