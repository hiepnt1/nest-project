import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { ChangePwdDto, UpdateAuthDto } from './dto/update-auth.dto';
import { LocalStrategy } from './passport/local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('log-in')
  // after create anotation Public => add @Public() don't check jwt
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch login")
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

  @Post('check-code')
  @Public()
  checkCode(@Body() code: CodeAuthDto) {

    return this.authService.checkCode(code)
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body("email") email: string) {
    return this.authService.retryActive(email)
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email: string) {
    return this.authService.retryPassword(email)
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePwdDto) {
    return this.authService.changePassword(data)
  }

  @Get('send-email')
  @Public()
  sendEmail() {
    return this.authService.sendEmail();
  }

}
