import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  function getInvalidDataResponse(res: NextApiResponse) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided',
    });
  }

  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!day || !time || !partySize) return getInvalidDataResponse(res);

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) return getInvalidDataResponse(res);

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return { ...obj, [table.table_id]: true };
      }, {});
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { tables: true, open_time: true, close_time: true },
  });

  if (!restaurant) return getInvalidDataResponse(res);

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  function getAvailabilityDate(time: string) {
    return new Date(`${day}T${time}`);
  }

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
