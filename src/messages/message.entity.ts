import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';

@Entity()
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  @Field(() => User)
  sender: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  @Field(() => ChatRoom)
  chatRoom: ChatRoom;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ default: false })
  @Field()
  isDeletedForSender: boolean;

  @Column({ default: false })
  @Field()
  isDeletedForEveryone: boolean;
}
