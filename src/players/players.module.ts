import { Module } from '@nestjs/common';
import { PlayersController } from './controllers/players.controller';
import { PlayersService } from './services/players.service';
import playerSchema from './schemas/player';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: playerSchema }]),
  ],
  providers: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
