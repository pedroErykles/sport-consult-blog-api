import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { userSchema } from './schema/user.schema';
import { UsersController } from './controllers/users.controller';
import { UploadService } from 'src/shared/upload/upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UserService, UploadService],
  exports: [UserService],
})
export class UsersModule {}
