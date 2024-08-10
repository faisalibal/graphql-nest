import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver'; // Jika Anda memiliki UsersResolver

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver], // Sertakan UsersResolver jika ada
  exports: [UsersService], // Penting: ekspor UsersService agar dapat digunakan oleh modul lain
})
export class UsersModule {}
