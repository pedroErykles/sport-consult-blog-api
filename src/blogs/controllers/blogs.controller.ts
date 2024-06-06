import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from '../services/blogs.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { isValidObjectId } from 'mongoose';
import { Request } from 'express';
import { BlogDTO } from '../types/dtos/blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ERemoveType } from 'src/players/types/enums/remove';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @IsPublic()
  @Get()
  async findBlogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    searchResult: any[];
    pagination: { limit: number; page: number; length: number };
  }> {
    const blogs = await this.blogsService.find({ limit, page });

    const length = blogs.length;
    /*const transformedBlogs = blogs.map((blog) => {
      return {
        id: blog._id,
        title: blog.title,
        subtitle: blog.subtitle,
        thumbPictureUrl: blog.thumbPictureUrl,
        relatedPlayers: blog.relatedPlayers,
        views: blog.viewsCount,
      };
    });
    */

    return {
      searchResult: blogs,
      pagination: { limit, page, length },
    };
  }

  @Get('trash')
  async findTrash() {
    return await this.blogsService.pullDataFromTrash();
  }

  @IsPublic()
  @Get(':id')
  async findById(@Req() req: Request) {
    return await this.blogsService.findById(req.params.id, req.ip);
  }

  @Post()
  async create(@Body() blog: BlogDTO) {
    return this.blogsService.create(blog);
  }

  @UseInterceptors(FileInterceptor('thumb'))
  @Post('thumb')
  async uploadThumb(@UploadedFile() file: Express.Multer.File) {
    const url = await this.blogsService.uploadThumb(file);
    return { url: url };
  }

  @UseInterceptors(FileInterceptor('thumb'))
  @Put('thumb/:id')
  async updateThumb(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.blogsService.updateThumb(file, id);
  }

  @Put('recovery/:id')
  async recovery(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Id isn't in a valid format`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.blogsService.recoveryFromTrash(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() blog: BlogDTO) {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Id isn't in a valid format`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.blogsService.update(id, blog);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('type', new ParseEnumPipe(ERemoveType))
    type: ERemoveType,
  ) {
    if (type == ERemoveType.SOFT) {
      return this.blogsService.softDelete(id);
    }

    return this.blogsService.removeBlog(id);
  }
}
