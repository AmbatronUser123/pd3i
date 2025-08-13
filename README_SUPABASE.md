# Supabase Integration for SPASI Mobile Health System

## Overview

This project is now connected to Supabase, providing backend services for:

- User Authentication
- Database Storage
- File Storage
- Realtime Subscriptions

## Connection Details

The Supabase connection is configured in the following files:

- `utils/supabase/info.tsx` - Contains your Supabase project ID and public anon key
- `utils/supabase/client.tsx` - Creates and exports the Supabase client
- `utils/supabase/auth.tsx` - Handles authentication operations
- `utils/supabase/database.tsx` - Provides database operation utilities
- `utils/supabase/test-connection.tsx` - Utilities to test the connection

## Testing the Connection

You can test your Supabase connection by:

1. Clicking the "Test Supabase Connection" button on the login page
2. This will show you connection details and allow you to verify that your project is properly connected

## Authentication

The application now supports:

- Email/password login
- User registration
- Profile management

## Database Operations

The `utils/supabase/database.tsx` file provides utilities for:

- Creating records
- Reading records
- Updating records
- Deleting records
- Querying records

## Usage Examples

### Authentication

```typescript
import { signIn, signUp, signOut } from '../utils/supabase/auth';

// Sign in
const user = await signIn('user@example.com', 'password');

// Sign up
const newUser = await signUp('user@example.com', 'password', 'username', 'puskesmas', 'location');

// Sign out
await signOut();
```

### Database Operations

```typescript
import { createRecord, getRecordById, updateRecord, deleteRecord } from '../utils/supabase/database';

// Create a record
const newCase = await createRecord('kasus', {
  disease: 'measles',
  form: 'MR01',
  status: 'draft',
  user_id: userId,
  // other fields...
});

// Get a record
const existingCase = await getRecordById('kasus', caseId);

// Update a record
const updatedCase = await updateRecord('kasus', caseId, {
  status: 'submitted',
  // other updated fields...
});

// Delete a record
await deleteRecord('kasus', caseId);
```

## Troubleshooting

If you encounter connection issues:

1. Verify your Supabase project is active
2. Check that the project ID and anon key in `utils/supabase/info.tsx` are correct
3. Use the connection test tool to diagnose specific issues
4. Check browser console for detailed error messages

## Next Steps

- Set up Row Level Security (RLS) policies in your Supabase project
- Configure storage buckets for file uploads
- Set up email templates for authentication
- Add additional authentication providers if needed