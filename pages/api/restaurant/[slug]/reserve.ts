import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import getInvalidDataResponse from '../../../../utils/getInvalidResponse';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });

  if (!restaurant) return getInvalidDataResponse(res, 'Restaurant not found');

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  )
    return getInvalidDataResponse(res, 'Restaurant is not open at that time');
  // http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=14:00:00.000Z&partySize=4
  // return res.json({ slug, day, time, partySize });
}
