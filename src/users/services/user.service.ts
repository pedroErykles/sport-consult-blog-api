import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../interface/users.interface';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from 'src/shared/supabase/upload.service';
import { fileDTO } from 'src/shared/supabase/types/upload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly uploadService: SupabaseService,
  ) {}

  isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  verifyUserData(user: UserDto): Error {
    if (!user.login) {
      return new Error('Login is mandatory');
    }

    if (!user.email) {
      return new Error('Email is mandatory');
    }
    if (!user.password) {
      return new Error('Password is mandatory');
    }
  }

  async getAll() {
    try {
      const users = await this.userModel.find().select('-password').exec();
      return users;
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
          `${id} is a invalid user ID`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userModel.findById(id).select('-password').exec();

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

    const verifyUserData = this.verifyUserData(user);

    if (verifyUserData) {
      throw new HttpException(verifyUserData.message, HttpStatus.BAD_REQUEST);
    }

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
    if (!this.isValidObjectId(id)) {
      throw new HttpException(
        `${id} is a invalid user ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const userData = await this.userModel.findById(id);

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const verifyUserData = this.verifyUserData(user);

    if (verifyUserData) {
      throw new HttpException(verifyUserData.message, HttpStatus.BAD_REQUEST);
    }

    const loginExists = await this.userModel.findOne({ login: user.login });
    const emailExists = await this.userModel.findOne({ email: user.email });

    if (user.login !== userData.login && loginExists) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }

    if (user.email !== userData.email && emailExists) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const userUpdated = {
        ...user,
        password: hashedPassword,
      };
      await this.userModel.updateOne({ _id: id }, userUpdated).exec();

      return { msg: 'User updated with successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new HttpException(
        `${id} is a invalid user ID`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
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
