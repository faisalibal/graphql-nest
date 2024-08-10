import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'graphql',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Jangan gunakan ini di production
};
