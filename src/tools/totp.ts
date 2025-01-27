import * as OTPAuth from 'otpauth';
import { NClientFrontend } from '../data/notification/index';

export function generateTOTPToken(secret: NClientFrontend['secret']): string {
  let totp = new OTPAuth.TOTP({
    issuer: 'BusNotification',
    label: 'BusNotification',
    algorithm: 'SHA256',
    digits: 8,
    period: 10,
    secret: secret
  });
  const token = totp.generate();
  return token;
}
