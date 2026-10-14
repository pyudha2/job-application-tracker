# Job Tracker

Kanban board to track job applications from wishlist to offer, with per-user accounts.

[Live demo](https://job-application-monitoring.vercel.app)

![Board](docs/board.png)

## Features

- Register and login with email and password
- Kanban board with five stages: Wishlist, Applied, Interview, Offer, Rejected
- Drag and drop cards between stages
- Create, edit, and delete applications (company, position, link, salary, deadline, notes)
- Status history for every application
- Deadline reminder for applications due within three days
- Search by company or position
- Stats page with count per stage and response rate

## Tech Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Prisma 7 with MariaDB/MySQL adapter
- NextAuth v4 (credentials)
- TanStack React Query
- dnd-kit
- Zod

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- MySQL or MariaDB running locally

### Installation

```bash
git clone https://github.com/pyudha2/job-application-tracker.git
cd job-application-tracker
npm install
cp .env.example .env
```

Create the database:

```sql
CREATE DATABASE job_tracker;
```

Fill in `.env`, then run the migration and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Connection string, used by the Prisma CLI |
| `DATABASE_HOST` | Database host |
| `DATABASE_PORT` | Database port |
| `DATABASE_USER` | Database user |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_NAME` | Database name |
| `NEXTAUTH_SECRET` | Random secret, generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL, `http://localhost:3000` in development |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server |
| `npx tsx scripts/check.ts` | Run the validation schema check |

## Project Structure

```
prisma/             schema and migrations
scripts/            validation check
src/app/(auth)/     login and register pages
src/app/(dashboard)/ board, application form and detail, stats
src/app/api/        auth, register, applications routes
src/components/     board and form components
src/hooks/          React Query hooks
src/lib/            auth, prisma client, validation, constants
src/providers/      React Query provider
```

## Deployment

Deployed on Vercel with a managed MySQL database.

1. Import the repository in Vercel.
2. Add all environment variables above. `DATABASE_URL` is required at build time because `prisma generate` reads `prisma.config.ts`.
3. Set `NEXTAUTH_URL` to the production domain.
4. Run the migration against the production database:

```bash
DATABASE_URL="mysql://user:pass@host:port/db" npx prisma migrate deploy
```

## Roadmap

- [ ] Card ordering inside a column
- [ ] Email reminders for deadlines and follow-ups
- [ ] Client-side form validation