import * as OTPAuth from 'otpauth';

export function generateTOTPToken(secret: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: 'Bus',
    label: 'Bus',
    algorithm: 'SHA256',
    digits: 8,
    period: 10,
    secret: secret
  });
  const token = totp.generate();
  return token;
}
