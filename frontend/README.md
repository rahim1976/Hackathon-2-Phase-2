# Todo Frontend Application

This is the frontend for the Todo Full-stack Web Application, built with Next.js 16+ and App Router.

## Features

- User authentication (registration and login)
- Task management (create, read, update, delete, mark complete)
- JWT-based authentication with automatic token injection
- Responsive design for desktop and mobile
- Protected routes and session management
- Form validation and error handling

## Tech Stack

- Next.js 16+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- NextAuth.js
- Axios for API calls

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication-related pages (login, register)
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── tasks/             # Task management pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── tasks/             # Task management components
│   │   ├── ui/                # Generic UI components
│   │   └── navigation/        # Navigation components
│   ├── services/              # API and business logic services
│   ├── hooks/                 # Custom React hooks
│   ├── contexts/              # React context providers
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL of your backend API (e.g., http://localhost:8000)
- `NEXTAUTH_URL`: The URL of your frontend application (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret used for encrypting JWTs and session data

## API Integration

The frontend communicates with the backend API using the centralized API client that automatically:
- Attaches JWT tokens to authenticated requests
- Handles token expiration and redirects
- Manages loading states during API calls
- Displays appropriate error messages
- Implements retry logic for failed requests

## Key Components

- `AuthProvider`: Wraps the application to provide authentication context
- `ProtectedRoute`: Ensures only authenticated users can access certain pages
- `api-client.ts`: Centralized API client with JWT injection
- `useAuth` and `useTasks`: Custom hooks for state management
- Various UI components in the `components/ui` directory