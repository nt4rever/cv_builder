import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { AES, enc } from 'crypto-js';
import * as moment from 'moment';

export function decryptToken(stringToDecrypt: string): string {
  try {
    const aesKey = process.env.AES_KEY;
    const decText = AES.decrypt(stringToDecrypt, aesKey).toString(enc.Utf8);
    return decText;
  } catch (error) {
    return null;
  }
}

export function getUserUUIDFromToken(token: string): string {
  try {
    const userUUIDHash = token.split('-')[2];
    return Buffer.from(userUUIDHash, 'base64').toString('ascii');
  } catch (error) {
    return null;
  }
}

export async function validateResetToken(
  user: User,
  token: string,
): Promise<boolean> {
  const [timeHBase64, reqUserStringHash] = token.split('-');
  const timestamp = Buffer.from(timeHBase64, 'base64').toString('ascii');
  const tokenTimestampDate = moment(timestamp);
  const now = moment();
  const diff = now.diff(tokenTimestampDate, 'hours');
  if (Math.abs(diff) > 24) return false;
  const userString = `${user.id}${user.email}${user.password}${user.updatedAt}`;
  const userStringHash = crypto
    .createHash('md5')
    .update(userString)
    .digest('hex');
  return reqUserStringHash === userStringHash;
}

export async function validateConfirmToken(
  user: User,
  token: string,
): Promise<boolean> {
  const [timeHBase64, reqUserStringHash] = token.split('-');
  const timestamp = Buffer.from(timeHBase64, 'base64').toString('ascii');
  const tokenTimestampDate = moment(timestamp);
  const now = moment();
  const diff = now.diff(tokenTimestampDate, 'hours');
  if (Math.abs(diff) > 720) return false;
  const userString = `${user.id}${user.email}${user.isActive}${user.updatedAt}`;
  const userStringHash = crypto
    .createHash('md5')
    .update(userString)
    .digest('hex');
  return reqUserStringHash === userStringHash;
}
