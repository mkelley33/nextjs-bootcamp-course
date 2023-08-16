import { NextApiRequest, NextApiResponse } from 'next';
import * as jose from 'jose';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

function getUnauthorizedRequest(res: NextApiResponse) {
  return res.status(401).json({ errorMessage: 'Unauthorized request' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers['authorization'] as string;

  if (!bearerToken) return getUnauthorizedRequest(res);

  const token = bearerToken.split(' ')[1];
  if (!token) getUnauthorizedRequest(res);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return getUnauthorizedRequest(res);
  }

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) return getUnauthorizedRequest(res);

  const user = (await prisma.user.findUnique({
    where: { email: payload.email },
  })) as Partial<User>;

  delete user.password;

  res.json({ user });
}
