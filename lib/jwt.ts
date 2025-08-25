import { SignJWT, jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signPromoJwt(payload: object, days = 30) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * days;
  return await new SignJWT({ ...payload, scope: 'promo', exp })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(secret());
}

export async function verifyPromoJwt(token: string) {
  const { payload } = await jwtVerify(token, secret());
  if (payload.scope !== 'promo') throw new Error('invalid scope');
  return payload;
}
