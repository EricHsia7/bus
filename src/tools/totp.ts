import * as OTPAuth from 'otpauth';

export function generateTOTPToken(clientID: string, secret: string): string {
  let totp = new OTPAuth.TOTP({
    issuer: 'BusNotification',
    label: clientID,
    algorithm: 'SHA256',
    digits: 6,
    period: 30,
    secret: secret
  });
  const token = totp.generate();
  return token;
}
