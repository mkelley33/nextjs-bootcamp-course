import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

// Required because we are returning the response in bcrypt's compare callback
export const config = {
  api: {
    externalResolver: true,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: 'Password is invalid',
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) errors.push(check.errorMessage);
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const user = (await prisma.user.findUnique({
      where: { email },
    })) as Partial<User>;

    const invalidMessage = 'Email or password is invalid';

    if (!user) return res.status(401).json({ errorMessage: invalidMessage });

    bcrypt.compare(password, user.password!, async (err, same) => {
      if (err) res.status(401).json({ errorMessage: invalidMessage });
      if (same) {
        const alg = 'HS256';
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        delete user.password;
        const token = await new jose.SignJWT({ email: user.email })
          .setProtectedHeader({
            alg,
          })
          .setExpirationTime('24h')
          .sign(secret);

        setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 });

        return res.status(200).json({ ...user });
      } else {
        return res.status(401).json({ errorMessage: invalidMessage });
      }
    });
  }
  if (req.method !== 'POST') return res.status(404).json('Unknown endpoint');
}
