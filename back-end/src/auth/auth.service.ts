import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyPasswordHelper } from '@/helper/utils/hashPassword';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) { }


  async signIn(email: string, plainPwd: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException("Not found user", HttpStatus.NOT_FOUND);
    }
    // check password
    const isMatchPassword = await verifyPasswordHelper(plainPwd, user.password)
    if (!isMatchPassword) throw new BadRequestException("Wrong email or password")

    const payload = { sub: user._id, username: user.name, email: user.email }
    console.log(payload)
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isMatchPassword = await verifyPasswordHelper(password, user.password)
    if (!user || !isMatchPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, username: user.name, email: user.email }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto)
  }

  async sendEmail() {
    await this.mailService
      .sendMail({
        to: 'nguyenthehiep3232@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome to my work', // plaintext body
        template: './confirmInfo',
        context: {
          name: "hepi",
          activationCode: 14564154556
        }
      })

    return 'ok'
  }
}
