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
  UseInterceptors,
  UploadedFile,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayersService } from '../services/players/players.service';
import { isValidObjectId } from 'mongoose';
import { PlayerDto } from '../types/dto/dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ERemoveType } from '../types/enums/remove';
import { footValues } from '../types/enums/foot';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from 'src/shared/supabase/supabase.service';

@Controller('players')
export class PlayersController {
  constructor(
    private playerService: PlayersService,
    private supabaseService: SupabaseService,
  ) {}

  @IsPublic()
  @Get()
  async findPlayers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    searchResult: any[];
    pagination: { limit: number; page: number; length: number };
  }> {
    const players = await this.playerService.find(
      { limit, page },
      { deletedAt: null },
    );

    const length = players.length;
    const transformedPlayers = players.map((player) => {
      return {
        id: player._id,
        name: player.name,
        profilePicture: player.profilePictureUrl,
        citizenship: player.citizenship,
        clubName: player.clubName,
        dateOfBirth: player.dateOfBirth,
        height: player.height,
        foot: player.foot,
        position: player.position,
        weight: player.weight,
        statistics: player.statistics,
        mediaList: player.mediaList,
      };
    });

    return {
      searchResult: transformedPlayers,
      pagination: { limit, page, length },
    };
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

  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMediaToPlayer(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') playerId: string,
    @Query('tag') tag: string,
  ) {
    if (!isValidObjectId(playerId)) {
      throw new HttpException(
        `The id in the params isn't a valid id`,
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(file);

    return this.playerService.uploadMedia(playerId, tag, file);
  }

  @Put('recovery/:id')
  async recoveryFromTrash(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(`It's not a valid id`, HttpStatus.BAD_REQUEST);
    }

    return await this.playerService.recoverFromTrash(id);
  }

  @Put('setProfilePicture/:id')
  @UseInterceptors(FileInterceptor('file'))
  async setProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') playerId: string,
  ) {
    if (!isValidObjectId(playerId)) {
      throw new HttpException(
        `The id in the params isn't a valid id`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.playerService.setProfilePicture(playerId, file);
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
      await this.playerService.removePlayer(id).then(() => {
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
