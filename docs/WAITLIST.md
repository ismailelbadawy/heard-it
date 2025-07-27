# Waitlist Integration

## Overview

The waitlist functionality has been implemented using Next.js Server Actions with Prisma database integration:

## Files Created/Updated

1. **`src/app/actions/waitlist.ts`** - Server action with Prisma database integration
2. **`src/hooks/use-waitlist.ts`** - Custom React hook for form state management
3. **`src/components/waitlist-form.tsx`** - Reusable waitlist form component
4. **`src/lib/prisma.ts`** - Prisma client configuration
5. **`schema.prisma`** - Database schema with Waitlist model

## Features

- ✅ Server-side form validation
- ✅ Email format validation
- ✅ Database persistence with Prisma
- ✅ Duplicate email detection
- ✅ **Beautiful confirmation emails with Resend**
- ✅ Loading states with spinner
- ✅ Success/error feedback
- ✅ Form reset on successful submission
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Two variants (hero and CTA sections)

## Database Schema

```prisma
model Waitlist {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    email     String   @unique
    status    String   @default("pending") // "pending", "confirmed", "rejected"
}
```

## Usage

The `WaitlistForm` component is used in two places on the landing page:

```tsx
// Hero section
<WaitlistForm variant="hero" />

// CTA section  
<WaitlistForm variant="cta" />
```

## Database Integration

The server action now automatically:
- Saves emails to the PostgreSQL database
- Prevents duplicate signups with unique email constraint
- **Sends beautiful confirmation emails via Resend**
- Provides user-friendly error messages for duplicates
- Stores signup timestamp and status

## Email Confirmation

New subscribers receive a professionally designed email featuring:
- HeardIt branding with gradient design
- Feature preview and expectations
- Responsive layout for all devices
- Call-to-action button
- Professional footer

See `EMAIL_SETUP.md` for complete email configuration instructions.

## Error Handling

The system handles several error cases:
- **Missing email**: "Email is required"
- **Invalid email format**: "Please enter a valid email address"  
- **Duplicate email**: "This email is already on our waitlist!"
- **Database errors**: "Something went wrong. Please try again."

## Integration Points

To add additional services, update the `joinWaitlist` server action in `src/app/actions/waitlist.ts`:

```typescript
// After successful database save, add:
// await addToEmailList(email) // Mailchimp, ConvertKit, etc.
// await sendConfirmationEmail(email)
// await sendSlackNotification(email)
```

## Common Integrations

### Database
```typescript
import { sql } from '@vercel/postgres'

await sql`INSERT INTO waitlist (email, created_at) VALUES (${email}, NOW())`
```

### Email Services
```typescript
// Mailchimp
import mailchimp from '@mailchimp/mailchimp_marketing'
await mailchimp.lists.addListMember(listId, { email_address: email })

// ConvertKit
import convertkit from 'convertkit-node'
await convertkit.subscribers.create({ email })
```

### Notifications
```typescript
// Send Slack notification
import { WebClient } from '@slack/web-api'
await slack.chat.postMessage({
  channel: '#waitlist',
  text: `New signup: ${email}`
})
```

## Database Management

### View Waitlist Entries
```bash
npx prisma studio
```

### Query Database
```sql
-- Count total signups
SELECT COUNT(*) FROM "Waitlist";

-- View recent signups
SELECT * FROM "Waitlist" ORDER BY "createdAt" DESC LIMIT 10;

-- Check for specific email
SELECT * FROM "Waitlist" WHERE email = 'user@example.com';
```

### Migration Commands
```bash
# Create new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Reset database (development only!)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Testing

1. **Local Testing**: Submissions are now saved to your PostgreSQL database
2. **Console Logs**: Successful signups log: `New waitlist signup saved to database: user@example.com`
3. **Duplicate Testing**: Try submitting the same email twice to test duplicate handling
