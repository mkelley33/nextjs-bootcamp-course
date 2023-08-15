import { Cuisine, Location, PRICE } from '@prisma/client';
import Link from 'next/link';
import Price from '../../components/Price';

interface IRestaurant {
  id: number;
  location: Location;
  name: string;
  slug: string;
  cuisine: Cuisine;
  main_image: string;
  price: PRICE;
}

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: IRestaurant;
}) {
  const { location, name, slug, cuisine, main_image, price } = restaurant;

  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={main_image} alt="" className="w-44 rounded h-36" />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">*****</div>
          <p className="ml-2 text-sm">Awesome</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price} />
            <p className="mr-4 capitalize">{cuisine.name}</p>
            <p className="mr-4 capitalize">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}
