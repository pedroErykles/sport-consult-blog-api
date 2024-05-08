import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../interface/users.interface';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { UploadService } from 'src/shared/upload/upload.service';
import { fileDTO } from 'src/shared/upload/upload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly uploadService: UploadService,
  ) {}

  isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async getAll() {
    try {
      const users = await this.userModel.find().exec();
      return {
        ...users,
        password: undefined,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string) {
    try {
      if (!this.isValidObjectId(id)) {
        throw new HttpException(
          `'${id}' is a invalid user ID`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(user: UserDto, confirmPassword: string, image: fileDTO) {
    const loginExists = await this.userModel.findOne({ login: user.login });
    const emailExists = await this.userModel.findOne({ email: user.email });
    let imageURL = '';

    if (loginExists) {
      throw new HttpException(
        'This login is already in use',
        HttpStatus.CONFLICT,
      );
    }
    if (emailExists) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }
    if (user.password != confirmPassword) {
      throw new HttpException(
        'Passwords are not the same',
        HttpStatus.CONFLICT,
      );
    }

    if (image) {
      imageURL = await this.uploadService.upload(image, 'users-images');
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const createdUser = new this.userModel({
        ...user,
        password: hashedPassword,
        image: imageURL,
      });
      await createdUser.save();

      return { msg: 'User created with successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, user: UserDto) {
    try {
      if (!this.isValidObjectId(id)) {
        throw new HttpException(
          `'${id} is a invalid user ID'`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.userModel.updateOne({ _id: id }, user).exec();
      return { msg: 'User updated with successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    try {
      if (!this.isValidObjectId(id)) {
        throw new HttpException(
          `'${id} is a invalid user ID'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.userModel.deleteOne({ _id: id }).exec();

      return { msg: 'User deleted with successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findByLogin(login: string) {
    return this.userModel.findOne({ login: login });
  }
}
