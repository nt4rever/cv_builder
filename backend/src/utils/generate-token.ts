import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { AES } from 'crypto-js';

export function generateToken(user: User) {
  const now = new Date();
  const timeBase64 = Buffer.from(now.toISOString()).toString('base64');
  const userUUIDBase64 = Buffer.from(user.id).toString('base64');
  const userString = `${user.id}${user.email}${user.password}${user.updatedAt}`;
  const userStringHash = crypto
    .createHash('md5')
    .update(userString)
    .digest('hex');
  const tokenize = `${timeBase64}-${userStringHash}-${userUUIDBase64}`;
  const aesKey = process.env.AES_KEY;
  const encText: string = AES.encrypt(tokenize, aesKey).toString();
  return encText;
}

export function generateConfirmToken(user: User) {
  const now = new Date();
  const timeBase64 = Buffer.from(now.toISOString()).toString('base64');
  const userUUIDBase64 = Buffer.from(user.id).toString('base64');
  const userString = `${user.id}${user.email}${user.isActive}${user.updatedAt}`;
  const userStringHash = crypto
    .createHash('md5')
    .update(userString)
    .digest('hex');
  const tokenize = `${timeBase64}-${userStringHash}-${userUUIDBase64}`;
  const aesKey = process.env.AES_KEY;
  const encText: string = AES.encrypt(tokenize, aesKey).toString();
  return encText;
}
