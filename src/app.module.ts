import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';

config();
const dbURL = process.env.DB_URL;

@Module({
  imports: [UsersModule, MongooseModule.forRoot(dbURL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
