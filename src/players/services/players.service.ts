import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import { Player } from '../types/interfaces/player';
import { PlayerDto } from '../types/dto/dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async find(
    pagination?: { limit: number; page: number },
    filter?: FilterQuery<Player>,
    options?: QueryOptions<Player>,
  ) {
    const result = !!pagination
      ? await this.playerModel
          .find(filter, undefined, options)
          .skip(pagination.page - 1)
          .limit(pagination.limit)
          .lean()
          .exec()
          .catch((e) => {
            throw new HttpException(e, 500);
          })
      : await this.playerModel
          .find(filter, undefined, options)
          .lean()
          .exec()
          .catch((e) => {
            throw new HttpException(e, 500);
          });

    return result;
  }

  async findById(id: string | number): Promise<Document> {
    return await this.playerModel
      .findOne({ _id: id, deletedAt: null })
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(e, 500);
      });
  }

  async create(player: PlayerDto) {
    const createdPlayer = await this.playerModel
      .create({
        name: player.name,
        personalInfo: player.personalInfo,
        statistics: player.statistics,
      })
      .catch((e) => {
        throw new HttpException(e, 500);
      });

    const savedResult = await createdPlayer.save().catch((e) => {
      throw new HttpException(e, 500);
    });

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async update(id: string | number, player: PlayerDto) {
    return await this.playerModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          $set: {
            name: player.name,
            personalInfo: player.personalInfo,
            statistics: player.statistics,
          },
        },
        { new: true },
      )
      .catch((e) => {
        throw new HttpException(e, 500);
      });
  }

  async remove(id: string | number) {
    return await this.playerModel.deleteOne({ _id: id }).catch((e) => {
      throw new HttpException(e, 500);
    });
  }

  //Move the player to trash, but you can recover it
  async softDelete(id: string | number) {
    const player = await this.playerModel.findById(id);
    player.deletedAt = new Date();
    player.markModified('deletedAt');

    player.save().catch((e) => {
      throw new HttpException(e, 500);
    });
    return HttpStatus.OK;
  }

  async findTrash() {
    return await this.playerModel
      .find({ deletedAt: { $ne: null } })
      .catch((e) => {
        throw new HttpException(e, 500);
      });
  }

  async recover(id: string | number) {
    return await this.playerModel
      .findOneAndUpdate({ _id: id }, { deletedAt: null })
      .catch((e) => {
        throw new HttpException(e, 500);
      });
  }
}
