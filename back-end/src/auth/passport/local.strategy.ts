import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    //return user
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new HttpException("Username/password not invalid", HttpStatus.UNAUTHORIZED);
        }
        if (user.isActive === false) {
            throw new HttpException("User account not active", HttpStatus.BAD_REQUEST);
        }
        return user
    }
}