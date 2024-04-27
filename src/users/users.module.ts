import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { userSchema } from './schema/user.schema';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
