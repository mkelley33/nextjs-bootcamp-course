import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';
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

  if (!day || !time || !partySize) return getInvalidDataResponse(res);

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { tables: true, open_time: true, close_time: true },
  });

  if (!restaurant) return getInvalidDataResponse(res);
  function getAvailabilityDate(time: string) {
    return new Date(`${day}T${time}`);
  }

  const searchTimesWithTables = await findAvailableTables({
    time,
    day,
    slug,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) return getInvalidDataResponse(res);

  const availabilities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return {
        time: t.time,
        available: sumSeats > parseInt(partySize, 10),
      };
    })
    .filter((availability) => {
      const availabilityDate = getAvailabilityDate(availability.time);
      const openDate = getAvailabilityDate(restaurant.open_time);
      const closeDate = getAvailabilityDate(restaurant.close_time);
      const timeIsAfterOpeningHour = availabilityDate >= openDate;
      const timeIsBeforeClosingHour = availabilityDate <= closeDate;
      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

  // http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-02-03&time=14:00:00.000Z&partySize=4
  return res.json(availabilities);
}
