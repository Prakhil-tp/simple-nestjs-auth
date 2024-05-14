import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IUser } from 'src/models';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async create(user: IUser): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
