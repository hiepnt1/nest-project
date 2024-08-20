import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyPasswordHelper } from '@/helper/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private readonly jwtService: JwtService
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
}
