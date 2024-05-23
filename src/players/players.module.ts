import { Module } from '@nestjs/common';
import { PlayersController } from './controllers/players.controller';
import { PlayersService } from './services/players.service';
import playerSchema from './schemas/player';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './services/upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: playerSchema }]),
  ],
  providers: [PlayersService, UploadService],
  controllers: [PlayersController],
})
export class PlayersModule {}
