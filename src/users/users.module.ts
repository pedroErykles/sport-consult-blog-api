import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { userSchema } from './schema/user.schema';
import { UsersController } from './controllers/users.controller';
import { SupabaseService } from 'src/shared/supabase/supabase.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UserService, SupabaseService],
  exports: [UserService],
})
export class UsersModule {}
