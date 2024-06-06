import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Player } from 'src/players/types/interfaces/player';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { fileDTO } from 'src/shared/supabase/types/upload.dto';
import { Blog } from '../types/interfaces/blog.interface';
import { BlogDTO } from '../types/dtos/blog.dto';
import { ESearchFilter } from '../types/enums/filter';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async find(
    pagination?: { limit: number; page: number },
    sort?: ESearchFilter,
    filter?: FilterQuery<Player>,
    options?: QueryOptions<Player>,
  ) {
    const { limit, page } = pagination;

    if (!(limit > 0 && page > 0)) {
      throw new HttpException(
        `Limit and page must be greater than 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (sort == ESearchFilter.RELEVANCY) {
      return await this.blogModel
        .aggregate([
          { $match: { deletedAt: null } },
          {
            $addFields: {
              viewsCount: { $size: '$views' },
              secondsSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'second',
                },
              },
              minutesSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'minute',
                },
              },
              hoursSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'hour',
                },
              },

              daysSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'day',
                },
              },
              weeksSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'week',
                },
              },
              monthsSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'month',
                },
              },
              yearsSincePost: {
                $dateDiff: {
                  startDate: '$createdAt',
                  endDate: new Date(),
                  unit: 'year',
                },
              },
            },
          },
          { $sort: { viewsCount: -1 } },
          { $skip: (page - 1) * limit },
          {
            $project: {
              views: 0,
              body: 0,
              relatedPlayers: 0,
              updatedAt: 0,
              createdAt: 0,
              deletedAt: 0,
              __v: 0,
            },
          },
        ])
        .catch((e) => {
          console.log(e);
          throw new HttpException(
            `Unable to retrieve blogs. Please try again later`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    }

    return await this.blogModel
      .aggregate([
        { $match: { deletedAt: null } },
        {
          $addFields: {
            viewsCount: { $size: '$views' },
            secondsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'second',
              },
            },
            minutesSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'minute',
              },
            },
            hoursSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'hour',
              },
            },

            daysSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'day',
              },
            },
            weeksSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'week',
              },
            },
            monthsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'month',
              },
            },
            yearsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'year',
              },
            },
          },
        },
        { $sort: { secondsSincePost: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            views: 0,
            body: 0,
            relatedPlayers: 0,
            updatedAt: 0,
            createdAt: 0,
            deletedAt: 0,
            __v: 0,
          },
        },
      ])
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Unable to retrieve blogs. Please try again later`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async findById(id: string | number, viewID: string) {
    await this.blogModel
      .updateOne(
        { _id: id, deletedAt: null, 'views.viewID': { $ne: viewID } },
        {
          $addToSet: { views: { viewID } },
        },
      )
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Couldn't get blog informations`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    const blog = await this.blogModel
      .aggregate([
        {
          $match: {
            $expr: { $eq: ['$_id', { $toObjectId: id }] },
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: 'players',
            localField: 'relatedPlayers',
            foreignField: '_id',
            as: 'relatedPlayers',
          },
        },
        {
          $unwind: '$relatedPlayers',
        },
        {
          $addFields: {
            viewsCount: { $size: '$views' },
            secondsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'second',
              },
            },
            minutesSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'minute',
              },
            },
            hoursSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'hour',
              },
            },

            daysSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'day',
              },
            },
            weeksSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'week',
              },
            },
            monthsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'month',
              },
            },
            yearsSincePost: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: new Date(),
                unit: 'year',
              },
            },
          },
        },
        {
          $project: {
            views: 0,
            updatedAt: 0,
            createdAt: 0,
            deletedAt: 0,
            __v: 0,
            'relatedPlayers.dateOfBirth': 0,
            'relatedPlayers.clubName': 0,
            'relaterPlayers.citizenship': 0,
            'relatedPlayers.height': 0,
            'relatedPlayers.weight': 0,
            'relatedPlayers.foot': 0,
            'relatedPlayers.statistics': 0,
            'relatedPlayers.mediaList': 0,
            'relatedPlayers.deletedAt': 0,
            'relatedPlayers.createdAt': 0,
            'relatedPlayers.updatedAt': 0,
            'relatedPlayers.__v': 0,
          },
        },
      ])
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Unable to retrieve blogs. Please try again later`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    if (!blog) {
      throw new HttpException(
        `Blog with the id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return blog;
  }

  async exists(id: string | number) {
    const result = await this.blogModel.exists({ _id: id, deletedAt: null });
    if (!result) {
      throw new HttpException(`Blog not found`, HttpStatus.NOT_FOUND);
    }
  }

  async create(blog: BlogDTO) {
    const createdBlog = await this.blogModel
      .create({
        title: blog.title,
        subtitle: blog.subtitle,
        body: blog.body,
        thumbPictureUrl: blog.thumbPictureUrl,
        location: blog.location,
        relatedPlayers: blog.relatedPlayers,
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Unable to create blog`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    const savedResult = await createdBlog.save().catch((e) => {
      console.log(e);
      throw new HttpException(
        `Unable to create blog`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async update(id: string | number, blog: BlogDTO) {
    const exists = await this.blogModel.exists({ _id: id, deletedAt: null });

    if (!exists) {
      throw new HttpException(`Blog not found`, HttpStatus.NOT_FOUND);
    }

    const updatedBlog = await this.blogModel
      .updateOne(
        { _id: id },
        {
          $set: {
            title: blog.title,
            subtitle: blog.subtitle,
            body: blog.body,
            thumbPictureUrl: blog.thumbPictureUrl,
            location: blog.location,
            relatedPlayers: blog.relatedPlayers,
          },
        },
        { new: true },
      )
      .lean()
      .catch((e) => {
        throw new HttpException(
          `Unable to update blog`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return updatedBlog;
  }

  async uploadThumb(file: Express.Multer.File) {
    const bucket = process.env.BLOGS_PUBLIC_BUCKET;

    const fileDto: fileDTO = {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
      buffer: file.buffer,
    };

    return await this.supabaseService.upload(fileDto, bucket);
  }

  async updateThumb(file: Express.Multer.File, id: string) {
    const bucket = process.env.BLOGS_PUBLIC_BUCKET;

    const fileDto: fileDTO = {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
      buffer: file.buffer,
    };

    const blog = await this.blogModel
      .findById(id)
      .select('- viewsList')
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Unable to update blog thumb`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    await this.supabaseService.remove(blog.thumbPictureUrl, bucket);

    const url = this.supabaseService.upload(fileDto, bucket);

    return await this.blogModel
      .updateOne({ _id: id }, { thumbPictureUrl: url })
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Unable to update blog thumb`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async removeBlog(id: string | number) {
    const blog = await this.blogModel.findById(id).lean().exec();
    if (!blog) {
      throw new HttpException(
        `Blog with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.supabaseService.remove(
      blog.thumbPictureUrl,
      process.env.BLOGS_PUBLIC_BUCKET,
    );

    return await this.blogModel.deleteOne({ _id: id }).catch((e) => {
      throw new HttpException(
        `Unable to delete blog`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  //Move the player to trash, but you can recover it
  async softDelete(id: string | number) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new HttpException(
        `Blog not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    blog.deletedAt = new Date();
    blog.markModified('deletedAt');

    blog.save().catch((e) => {
      throw new HttpException(
        `Unable to move blog to trash.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async pullDataFromTrash() {
    return await this.blogModel
      .find({ deletedAt: { $ne: null } })
      .select(['title', 'deletedAt', 'thumbPictureUrl'])
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Failed to retrieve blogs from trash`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async recoveryFromTrash(id: string | number) {
    const blog = await this.blogModel
      .exists({ _id: id, deletedAt: { $ne: null } })
      .exec();

    if (!blog) {
      throw new HttpException(
        `Blog with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.blogModel
      .updateOne({ _id: id }, { deletedAt: null })
      .catch((e) => {
        throw new HttpException(
          `Failed to recover blog from trash`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
