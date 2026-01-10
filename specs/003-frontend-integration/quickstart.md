# Quickstart Guide: Todo Frontend Integration

## Prerequisites

- Node.js 18+ with npm or yarn
- Access to the backend API (from Spec 1) and authentication system (from Spec 2)
- Environment variables configured for API endpoints

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables by copying `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API
   - `NEXTAUTH_URL`: Base URL for the application
   - `NEXTAUTH_SECRET`: Secret for NextAuth (should match backend secret)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to [http://localhost:3000](http://localhost:3000)

## Frontend Architecture Overview

### Page Structure (App Router)
- `/` - Landing page
- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - Main dashboard
- `/tasks` - Task management page
- `/tasks/[id]` - Individual task view/edit

### Component Structure
- `components/auth/` - Authentication-related components
- `components/tasks/` - Task management components
- `components/ui/` - Generic UI components
- `components/navigation/` - Navigation components

### Service Layer
- `services/api-client.ts` - Centralized API client with JWT injection
- `services/auth-service.ts` - Authentication business logic
- `services/task-service.ts` - Task management business logic

### State Management
- `contexts/AuthContext.tsx` - Authentication state management
- `hooks/useAuth.ts` - Authentication state hook
- `hooks/useTasks.ts` - Task state management hook

## Key User Flows

### Registration Flow
1. User visits `/register`
2. Fills in registration form
3. Form validates input
4. Submits to authentication API
5. Receives JWT token
6. Redirects to dashboard

### Login Flow
1. User visits `/login`
2. Enters credentials
3. Form validates input
4. Authenticates with backend API
5. Receives JWT token
6. Redirects to dashboard

### Task Management Flow
1. User navigates to `/tasks`
2. Authenticated user sees their task list
3. Can create, update, or delete tasks
4. All API calls include JWT token automatically
5. Loading, error, and empty states handled appropriately

## API Client Integration

The frontend uses a centralized API client that automatically:
- Attaches JWT tokens to authenticated requests
- Handles token expiration and redirects
- Manages loading states during API calls
- Displays appropriate error messages
- Implements retry logic for failed requests

## Environment Configuration

Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: The base URL of your backend API
- `NEXTAUTH_URL`: The URL of your frontend application
- `NEXTAUTH_SECRET`: Secret used for encrypting JWTs and session data

Example `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
```

## Testing

Run frontend tests:
```bash
npm test
# or
yarn test
```

Run end-to-end tests:
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Deployment

Build for production:
```bash
npm run build
# or
yarn build
```

Start production server:
```bash
npm start
# or
yarn start
```

## Troubleshooting

### Common Issues
- **401 Unauthorized**: Check that JWT token is properly stored in browser storage
- **API Connection Issues**: Verify NEXT_PUBLIC_API_BASE_URL is correct
- **SSR Issues**: Ensure all authentication-dependent data is handled on the client side
- **Styling Issues**: Verify Tailwind CSS is properly configured

### Debugging Authentication
- Check browser's localStorage for `next-auth.session-token`
- Verify the JWT token format and expiration
- Use browser dev tools to inspect API request headers

## Next Steps

1. Customize the UI components to match your design requirements
2. Add additional validation to forms as needed
3. Extend the API client with additional error handling
4. Add more comprehensive tests for your specific use cases