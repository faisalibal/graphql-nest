import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { ChatRoom } from 'src/chat-room/chat-room.entity';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
  ) {}

  @Query(() => [Message])
  async messages(
    @Args('chatRoomId') chatRoomId: number,
    @Args('userId') userId: number,
  ): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { chatRoom: { id: chatRoomId }, isDeletedForEveryone: false },
        {
          chatRoom: { id: chatRoomId },
          sender: { id: userId },
          isDeletedForSender: false,
        },
      ],
      relations: ['sender', 'chatRoom'],
      order: { createdAt: 'ASC' },
    });
  }

  @Mutation(() => Message)
  async createMessage(
    @Args('content') content: string,
    @Args('senderId') senderId: number,
    @Args('chatRoomId') chatRoomId: number,
  ): Promise<Message> {
    const sender = await this.usersRepository.findOne({
      where: { id: senderId },
    });
    const chatRoom = await this.chatRoomsRepository.findOne({
      where: { id: chatRoomId },
    });
    const message = this.messagesRepository.create({
      content,
      sender,
      chatRoom,
    });
    await this.messagesRepository.save(message);
    pubSub.publish('messageAdded', { messageAdded: message, chatRoomId });
    return message;
  }

  @Mutation(() => Boolean)
  async deleteMessageForSender(
    @Args('messageId') messageId: number,
    @Args('senderId') senderId: number,
  ): Promise<boolean> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId, sender: { id: senderId } },
    });
    if (!message) {
      return false;
    }
    message.isDeletedForSender = true;
    await this.messagesRepository.save(message);
    pubSub.publish('messageDeleted', {
      messageDeleted: message,
      chatRoomId: message.chatRoom.id,
    });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMessageForEveryone(
    @Args('messageId') messageId: number,
    @Args('senderId') senderId: number,
  ): Promise<boolean> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId, sender: { id: senderId } },
    });
    if (!message) {
      return false;
    }
    message.isDeletedForEveryone = true;
    await this.messagesRepository.save(message);
    pubSub.publish('messageDeletedForEveryone', {
      messageDeletedForEveryone: message,
      chatRoomId: message.chatRoom.id,
    });
    return true;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => payload.chatRoomId === variables.chatRoomId,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messageAdded(@Args('chatRoomId') chatRoomId: number) {
    return pubSub.asyncIterator('messageAdded');
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => payload.chatRoomId === variables.chatRoomId,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messageDeleted(@Args('chatRoomId') chatRoomId: number) {
    return pubSub.asyncIterator('messageDeleted');
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => payload.chatRoomId === variables.chatRoomId,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messageDeletedForEveryone(@Args('chatRoomId') chatRoomId: number) {
    return pubSub.asyncIterator('messageDeletedForEveryone');
  }
}
