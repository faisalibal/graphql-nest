import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Message } from 'src/messages/message.entity';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  participants: User[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  @Field(() => [Message])
  messages: Message[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
