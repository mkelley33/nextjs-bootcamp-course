# Notes

## Cool stuff

https://rickandmortyapi.com/api/character

## Pages and Layout

You can extract the params from pages and layout

## Prisma setup

set DATABASE_URL in .env

Create schema.prisma in prisma directory you must create at the root level of your project.

npx prisma init
npx prisma db push
npx prisma db pull
npx prisma generate

## Trouble shooting

If you get an error visiting /api/seed, go to setting in supabase and scroll down until you see 'restart project' and click that button.

Comment out the seed file after running it to avoid getting additonal errors in your console.
