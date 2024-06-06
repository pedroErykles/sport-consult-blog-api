import { Module } from '@nestjs/common';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsService } from './services/blogs.service';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { MongooseModule } from '@nestjs/mongoose';
import blogsSchema from './schema/blogs.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Blog', schema: blogsSchema }])],
  controllers: [BlogsController],
  providers: [BlogsService, SupabaseService],
})
export class BlogsModule {}
