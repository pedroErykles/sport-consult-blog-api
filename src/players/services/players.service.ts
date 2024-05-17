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
    if (pagination) {
      const { limit, page } = pagination;

      if (!(limit > 0 && page > 0)) {
        throw new HttpException(
          `Limit and page must be greater than 0`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.playerModel
        .find(filter, undefined, options)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ name: 1 })
        .lean()
        .exec()
        .catch((e) => {
          throw new HttpException(
            `Unable to search players. Please try again later`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    }

    const result = await this.playerModel
      .find(filter, undefined, options)
      .sort({ name: 1 })
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Unable to search players. Please try again later`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return result;
  }

  async findById(id: string | number): Promise<Document> {
    const player = await this.playerModel
      .findOne({ _id: id, deletedAt: null })
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Unable to search player. Please try again later.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    if (!player) {
      throw new HttpException(
        `Player with the id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return player;
  }

  async create(player: PlayerDto) {
    const createdPlayer = await this.playerModel
      .create({
        name: player.name,
        dateOfBirth: player.dateOfBirth,
        clubName: player.clubName,
        citizenship: player.citizenship,
        height: player.height,
        position: player.position,
        weight: player.weight,
        foot: player.foot,
        statistics: player.statistics,
        mediaList: player.mediaList,
      })
      .catch((e) => {
        throw new HttpException(
          `Unable to create player`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    const savedResult = await createdPlayer.save().catch((e) => {
      throw new HttpException(
        `Unable to create player`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async update(id: string | number, player: PlayerDto) {
    const updatedPlayer = await this.playerModel
      .updateOne(
        { _id: id, deletedAt: null },
        {
          $set: {
            name: player.name,
            dateOfBirth: player.dateOfBirth,
            clubName: player.clubName,
            citizenship: player.citizenship,
            height: player.height,
            position: player.position,
            weight: player.weight,
            foot: player.foot,
            statistics: player.statistics,
            mediaList: player.mediaList,
          },
        },
        { new: true },
      )
      .lean()
      .catch((e) => {
        throw new HttpException(
          `Unable to update player`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return updatedPlayer;
  }

  async remove(id: string | number) {
    if (!this.playerModel.findById(id).lean()) {
      throw new HttpException(
        `Player with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.playerModel.deleteOne({ _id: id }).catch((e) => {
      throw new HttpException(
        `Unable to delete player`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  //Move the player to trash, but you can recover it
  async softDelete(id: string | number) {
    const player = await this.playerModel.findById(id);
    if (!player) {
      throw new HttpException(
        `Player not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    player.deletedAt = new Date();
    player.markModified('deletedAt');

    player.save().catch((e) => {
      throw new HttpException(
        `Unable to move player to trash.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async pullDataFromTrash() {
    return await this.playerModel
      .find({ deletedAt: { $ne: null } })
      .lean()
      .exec()
      .catch((e) => {
        throw new HttpException(
          `Failed to retrieve players from trash`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async recoverFromTrash(id: string | number) {
    const player = await this.playerModel.findById(id).lean().exec();
    if (!player) {
      throw new HttpException(
        `Player with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.playerModel
      .updateOne({ _id: id }, { deletedAt: null })
      .catch((e) => {
        throw new HttpException(
          `Failed to recover player from trash`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
