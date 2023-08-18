This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The content of this repo was built out using this nextjs bootcamp course:

[https://www.udemy.com/course/the-nextjs-13-bootcamp-the-complete-developer-guide/](https://www.udemy.com/course/the-nextjs-13-bootcamp-the-complete-developer-guide/)

## Getting Started

You'll need to sign up for a supabase account and start a project.

Once you're in your project be sure to go to the Project Settings and select the Database link.
Scroll down until you see the connection string like this and copy it:

```bash
postgres://postgres:[YOUR-PASSWORD]@db.dzwerwertkkertertqc.supabase.co:6543/postgres
```

You'll need to set some environment variables in the **.env** file you must create in the root directory:

```bash
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.dzwerwertkkertertqc.supabase.co:6543/postgres"

JWT_SECRET="set-some-long-gibberish-string"
```

Next you'll need to push up your schema to supabase via prisma:

```bash
npx prisma db push
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Seed the database by visiting [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
