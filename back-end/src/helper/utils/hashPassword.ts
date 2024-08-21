import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
const salt = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    const hashPwd = await bcrypt.hash(plainPassword, salt);
    return hashPwd;
}

export const verifyPasswordHelper = async (plainPassword: string, hashPassword: string) => {
    const isMatchPwd = await bcrypt.compare(plainPassword, hashPassword)
    if (isMatchPwd) return true;

    return false;

}