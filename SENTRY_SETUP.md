# Sentry Setup Guide

This project has been configured with Sentry for centralized logging and error tracking.

## Configuration

### 1. Create a Sentry Account

1. Go to [Sentry.io](https://sentry.io) and create an account
2. Create a new project for your application
3. Select "Next.js" as your platform

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your Sentry configuration:

```bash
cp .env.example .env.local
```

Then update the following values in `.env.local`:

```env
# Required: Your Sentry DSN (Data Source Name)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Optional: For source map uploads (recommended for production)
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug

# Optional: Enable Sentry in development
NEXT_PUBLIC_SENTRY_ENABLE_DEV=false
SENTRY_ENABLE_DEV=false
```

### 3. Getting Your Configuration Values

#### DSN (Data Source Name)
1. Go to your Sentry project settings
2. Navigate to "Client Keys (DSN)"
3. Copy the DSN value

#### Auth Token (for source maps)
1. Go to [Sentry Account Settings](https://sentry.io/settings/account/api/auth-tokens/)
2. Create a new auth token with the following scopes:
   - `project:releases`
   - `org:read`
3. Copy the generated token

#### Organization and Project Slugs
1. Find these in your Sentry project URL: `https://sentry.io/organizations/[org-slug]/projects/[project-slug]/`

## Features Configured

### Error Tracking
- Client-side errors (browser) - via `instrumentation-client.ts`
- Server-side errors (Node.js) - via `instrumentation.ts`
- Edge runtime errors (middleware) - via `instrumentation.ts`
- Custom error boundaries with Sentry integration

### Error Handling
- Custom error classes with proper Sentry integration
- Automatic error logging with context
- Error filtering to reduce noise
- Development/production environment handling

### Session Replay
- Configured to capture session replays on errors
- Privacy-focused configuration (masks text and blocks media)

### Performance Monitoring
- Transaction sampling configured (10% in production, 100% in development)
- Automatic performance tracking for Next.js routes

## Usage

### Logging Errors

The application automatically captures unhandled errors. For manual error logging:

```typescript
import { logError } from '~/lib/error-handling';

try {
  // Your code
} catch (error) {
  logError(error as Error, {
    // Additional context
    userId: user.id,
    action: 'fetchData'
  });
}
```

### Custom Error Classes

Use the provided error classes for better error tracking:

```typescript
import { AppError, GitHubAPIError, RateLimitError, NotFoundError } from '~/lib/error-handling';

// Generic application error
throw new AppError('Something went wrong', 'VALIDATION_ERROR', 400);

// GitHub API specific errors
throw new GitHubAPIError('Failed to fetch repositories');
throw new RateLimitError();
throw new NotFoundError('Repository not found');
```

## Testing Sentry Integration

To test if Sentry is working correctly:

1. Add a test button to trigger an error:
```typescript
<button onClick={() => { throw new Error('Test Sentry Error'); }}>
  Test Sentry
</button>
```

2. Check your Sentry dashboard to see if the error appears

## Production Deployment

When deploying to production:

1. Ensure all Sentry environment variables are set in your hosting platform
2. Source maps will be automatically uploaded during the build process
3. Monitor your Sentry dashboard for real-time error tracking

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Error Tracking](https://docs.sentry.io/product/issues/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)