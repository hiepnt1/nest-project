import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
const salt = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        const hashPwd = await bcrypt.hash(plainPassword, salt);
        return hashPwd;
    } catch (error) {
        console.log(error)
    }
}

export const verifyPasswordHelper = async (plainPassword: string, hashPassword: string) => {
    try {
        const isMatchPwd = await bcrypt.compare(plainPassword, hashPassword)
        if (isMatchPwd) return true;
    } catch (error) {
        throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST)
    }
}