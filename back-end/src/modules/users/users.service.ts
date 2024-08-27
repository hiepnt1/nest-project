import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { hashPasswordHelper } from '@/helper/utils/hashPassword';
import aqp from 'api-query-params';
import { v4 as uuidv4 } from 'uuid'
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePwdDto } from '@/auth/dto/update-auth.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailService: MailerService
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
    return {
      results, totalPages, meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        totalItems: totalItems
      }
    };
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

  async handleRegister(registerDto: CreateAuthDto) {
    const { email, password, name } = registerDto

    // check email exist
    const isExist = await this.isEmailExist(email)
    if (isExist) {
      throw new HttpException("User with that email already exist", HttpStatus.BAD_REQUEST)
    }

    const hashPwd = await hashPasswordHelper(password)
    const codeId = uuidv4()
    const user = await this.userModel.create({
      name,
      password: hashPwd,
      email,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(1, 'h')
    })

    this.mailService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Activation your account', // Subject line
        template: './confirmInfo',
        context: {
          name: user?.name ?? user?.email,
          activationCode: codeId
        }
      })

    return { _id: user._id }
  }

  async handleActive(code: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: code._id,
      codeId: code.code
    })

    if (!user) {
      throw new HttpException("Code invalid or expired", HttpStatus.BAD_REQUEST)
    }

    // check expired code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)

    if (isBeforeCheck) {
      user.isActive = true;
      await user.save();

      return user
    } else {
      throw new HttpException("Code invalid or expired", HttpStatus.BAD_REQUEST)
    }
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email })

    if (!user) throw new HttpException("Account not exist", HttpStatus.NOT_FOUND);

    if (!user.isActive) {
      const codeId = uuidv4();

      // update user
      await user.updateOne({
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes')
      })

      //send email
      await this.mailService
        .sendMail({
          to: user?.email, // list of receivers
          subject: 'Retry Active Account ✔', // Subject line
          template: './confirmInfo',
          context: {
            name: user?.name ?? user?.email,
            activationCode: codeId
          }
        })

      return { _id: user._id, message: "Code has sent, please check your email" };
    }
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email })

    if (!user) throw new HttpException("Account not exist", HttpStatus.NOT_FOUND);

    if (!user.isActive) {
      throw new HttpException("Account not active", HttpStatus.BAD_REQUEST);
    }

    const codeId = uuidv4();

    // update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    await this.mailService
      .sendMail({
        to: user?.email, // list of receivers
        subject: 'Change your password ✔', // Subject line
        template: './confirmInfo',
        context: {
          name: user?.name ?? user?.email,
          activationCode: codeId
        }
      })

    return { email: user.email, _id: user._id };
  }

  async changePassword(data: ChangePwdDto) {
    if (data.password !== data.confirmPassword) {
      throw new HttpException("Password/Confirm password not match", HttpStatus.FORBIDDEN)
    }

    // check email
    const user = await this.userModel.findOne({ email: data.email })

    if (!user) throw new HttpException("Account not exist", HttpStatus.NOT_FOUND);

    // check expired code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)

    if (isBeforeCheck) {
      // hash password;
      const hashPassword = await hashPasswordHelper(data.password);
      user.password = hashPassword;
      await user.save();

      return user
    } else {
      throw new HttpException("Code invalid or expired", HttpStatus.BAD_REQUEST)
    }
  }
}
