import Header from './components/Header';
import SearchSideBar from './components/SearchSideBar';
import RestaurantCard from './components/RestaurantCard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchRestaurants = (location: string | undefined) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!location) return prisma.restaurant.findMany({ select });
  return prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: location.toLowerCase(),
        },
      },
    },
    select,
  });
};

const fetchLocations = () => {
  return prisma.location.findMany();
};

const fetchCuisines = () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const restaurants = await fetchRestaurants(searchParams.city as string);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar locations={locations} cuisines={cuisines} />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </>
          ) : (
            <p>Sorry, there are no restaurants in that location</p>
          )}
        </div>
      </div>
    </>
  );
}
