import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PlayersModule } from './players/players.module';
import { BlogsModule } from './blogs/blogs.module';

config();
const dbURL = process.env.DB_URL;

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(dbURL),
    AuthModule,
    PlayersModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
