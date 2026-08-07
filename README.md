# DropX

A simple file storage application built with Next.js, Clerk, Neon, Drizzle, and HeroUI.

## Features

- User authentication with Clerk
- File uploads with ImageKit
- File management (star, trash)
- Responsive UI with HeroUI

## Tech Stack

- **Frontend**: Next.js, HeroUI
- **Authentication**: [Clerk](https://hitesh.ai/Clerk)
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle
- **File Storage**: [ImageKit](https://hitesh.ai/imagekit)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account
- Neon PostgreSQL database
- ImageKit account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/DropX.git
   cd DropX
   ```

2. Install dependencies:
   _(Note: This project includes an `.npmrc` configured with `legacy-peer-deps=true` to handle peer dependency conflicts between Next.js, ESLint, and HeroUI)_

   ```bash
   npm install
   # or if using other package managers:
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Fallback URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Database - Neon PostgreSQL
   DATABASE_URL=your_neon_database_url
   ```

4. Set up your accounts and get the required API keys:
   - Create a [Clerk](https://clerk.dev/) account and get your API keys
   - Create a [Neon](https://neon.tech/) PostgreSQL database and get your connection string
   - Create an [ImageKit](https://imagekit.io/) account and get your API keys

### Database Management

This project uses Drizzle ORM. You can use the following commands to manage your database schema:

```bash
# Push schema changes directly to the database
npm run db:push

# Generate a migration file from schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio to view and manage your data locally
npm run db:studio
```

### Running the Application

1. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```
