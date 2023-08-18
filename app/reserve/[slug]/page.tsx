import Header from './components/Header';
import Form from './components/Form';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function Reserve({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const { slug } = params;
  const { main_image, name } = await fetchRestaurantBySlug(slug);
  const { date, partySize } = searchParams;
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={main_image}
          name={name}
          date={date}
          partySize={partySize}
        />
        <Form partySize={partySize} slug={slug} date={date} />
      </div>
    </div>
  );
}
