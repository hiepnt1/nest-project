import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalStrategy } from './passport/local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorator/metaDataGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('log-in')
  // after create anotation Public => add @Public() don't check jwt
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('login')
  login(@Body() dataUser: CreateAuthDto) {
    return this.authService.signIn(dataUser.email, dataUser.password)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto)
  }

  @Get('send-email')
  @Public()
  sendEmail() {
    return this.authService.sendEmail();
  }

}
