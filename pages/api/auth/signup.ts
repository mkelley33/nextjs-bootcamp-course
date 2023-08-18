import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { firstName, lastName, city, phone, email, password } = req.body;
    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'First name is invalid',
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'First name is invalid',
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid',
      },
      {
        valid: validator.isLength(city, {
          min: 1,
        }),
        errorMessage: 'City is invalid',
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough',
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      res.status(400).json({ errorMessage: errors[0] });
    }

    const userWithEmail = await prisma.user.findUnique({ where: { email } });

    if (userWithEmail) {
      res
        .status(400)
        .json({ errorMessage: 'Email is associated with another account' });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err)
        res
          .status(400)
          .json({ errorMessage: 'There was an error creating your account' });

      const user = (await prisma.user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          city,
          password: hash,
          phone,
        },
      })) as Partial<User>;

      delete user.password;

      const alg = 'HS256';
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const token = await new jose.SignJWT({ email: user.email })
        .setProtectedHeader({
          alg,
        })
        .setExpirationTime('24h')
        .sign(secret);
      setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 });
      return res.status(200).json({ ...user });
    });
  }
  if (req.method !== 'POST') return res.status(404).json('Unknown endpoint');
}
