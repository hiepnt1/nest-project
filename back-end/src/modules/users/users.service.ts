import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { hashPasswordHelper } from '@/helper/utils/hashPassword';
import aqp from 'api-query-params';
import { Request } from 'express';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true

    return false;
  }

  async create(createUserDto: CreateUserDto) {

    const hashPwd = await hashPasswordHelper(createUserDto.password)

    // check email exist
    const isExist = await this.isEmailExist(createUserDto.email)
    if (isExist) {
      console.log('error')
      throw new HttpException("User with that email already exist", HttpStatus.BAD_REQUEST)
    }

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPwd
    })
    return { _id: user._id }

  }

  // get all user => pagination page users  
  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // count page, skip 
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (totalPages - 1) * pageSize;

    const results = await this.userModel.find(filter).limit(pageSize).skip(skip).sort(sort as any).select('-password')
    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {

      const { deletedCount } = await this.userModel.deleteOne({ _id: _id })
      if (deletedCount === 1) return JSON.stringify({ message: 'User deleted successfully' })
      else return JSON.stringify({ message: 'Failed to delete user' })
    }
    else
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
  }
}
