# Notes

## Cool stuff

https://rickandmortyapi.com/api/character

## Pages and Layout

You can extract the params from pages and layout

## Search params

```js
// As a prop type searchParams this way
searchParams: { city: string; cuisine: string; price: PRICE };

// Spread searchParams so that they don't get replaced each time you click a link
<Link
  href={{
    pathname: '/search',
    query: { ...searchParams, city: location.name }, // replace city value, but not other search params
  }}
```

## Prisma setup

set DATABASE_URL in .env

Create schema.prisma in prisma directory you must create at the root level of your project.
This is where your models go.

npx prisma db push will update your database with models

npx prisma init
npx prisma db push
npx prisma db pull
npx prisma generate

## Trouble shooting

If you get an error visiting /api/seed, go to setting in supabase and scroll down until you see 'restart project' and click that button.

Comment out the seed file after running it to avoid getting additonal errors in your console.
