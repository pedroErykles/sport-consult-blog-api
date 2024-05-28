import { Module } from '@nestjs/common';
import { PlayersController } from './controllers/players.controller';
import { PlayersService } from './services/players/players.service';
import playerSchema from './schemas/player';
import { MongooseModule } from '@nestjs/mongoose';
import { SupabaseService } from 'src/shared/supabase/supabase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: playerSchema }]),
  ],
  providers: [PlayersService, SupabaseService],
  controllers: [PlayersController],
})
export class PlayersModule {}
