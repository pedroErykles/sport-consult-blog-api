import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { isValidObjectId } from 'mongoose';
import { PaginationOptions, PlayerDto } from '../types/dto/dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ERemoveType } from '../types/enums/remove';
import { footValues } from '../types/enums/foot';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @IsPublic()
  @Get()
  async findPlayers(@Body() paginationOp?: PaginationOptions) {
    if (paginationOp) {
      const { limit, page } = paginationOp;

      const players = await this.playerService.find(
        {
          limit: limit,
          page: page,
        },
        { deletedAt: null },
      );

      const pagination = { limit, page, total: players.length };

      return { results: players, pagination };
    }

    return await this.playerService.find(undefined, { deletedAt: null });
  }

  @Get('/trash')
  async getTrash() {
    return await this.playerService.pullDataFromTrash();
  }

  @IsPublic()
  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `The id in the params isn't a valid id`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.playerService.findById(id);
  }

  @Post()
  async create(@Body() player: PlayerDto) {
    if (!footValues.includes(player.foot)) {
      throw new HttpException(
        `${player.foot} isn't a valid foot type`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.playerService.create(player);
  }

  @Put('recovery/:id')
  async recoveryFromTrash(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(`It's not a valid id`, HttpStatus.BAD_REQUEST);
    }

    return await this.playerService.recoverFromTrash(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() player: PlayerDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException(`Invalid id: ${id}`, HttpStatus.BAD_REQUEST);
    }

    if (!footValues.includes(player.foot)) {
      throw new HttpException(
        `${player.foot} isn't a valid foot type`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.playerService.update(id, player);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('type') type: ERemoveType = ERemoveType.SOFT,
  ) {
    if (!isValidObjectId(id)) {
      throw new HttpException(`It's not a valid id`, HttpStatus.BAD_REQUEST);
    }

    if (type == ERemoveType.HARD) {
      await this.playerService.remove(id).then(() => {
        return `Player data deleted succesfully`;
      });
    } else if (type == ERemoveType.SOFT) {
      await this.playerService.softDelete(id).then(() => {
        return `Player data moved to trash`;
      });
    } else {
      throw new HttpException(
        `${type} isn't a valid delete option`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
