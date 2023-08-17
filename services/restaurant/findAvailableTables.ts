import { PrismaClient, Table } from '@prisma/client';
import { NextApiResponse } from 'next';

import { times } from '../../data';
import getInvalidDataResponse from '../../utils/getInvalidResponse';

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  day,
  res,
  restaurant,
}: {
  time: string;
  day: string;
  res: NextApiResponse;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  } | null;
}) => {
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

  return searchTimesWithTables;
};
