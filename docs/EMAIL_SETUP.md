# Email Configuration Guide

## Overview

HeardIt now sends beautiful confirmation emails to waitlist subscribers using Resend, a modern email service provider.

## Setup Instructions

### 1. Get a Resend API Key

1. Visit [resend.com](https://resend.com) and create an account
2. Go to [API Keys](https://resend.com/api-keys) in your dashboard
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Resend API Key
RESEND_API_KEY=re_your_actual_api_key_here

# Your existing database URL
DATABASE_URL="your_database_url_here"
```

### 3. Domain Setup (Optional but Recommended)

For production use, you should set up a custom domain:

1. In your Resend dashboard, go to **Domains**
2. Add your domain (e.g., `heardit.com`)
3. Add the required DNS records to your domain provider
4. Update the `from` field in the email code from `waitlist@heardit.com` to your verified domain

## Email Template Features

The confirmation email includes:

✅ **Beautiful Design**: Gradient header with HeardIt branding  
✅ **Responsive Layout**: Works on all devices and email clients  
✅ **Feature Preview**: Shows what users can expect from HeardIt  
✅ **Call-to-Action**: Button linking back to your website  
✅ **Professional Footer**: Contact info and unsubscribe options  
✅ **Emojis & Visuals**: Makes the email engaging and friendly  

## Email Content

- **Subject**: "Welcome to HeardIt Waitlist! 🎉"
- **From**: "HeardIt <waitlist@heardit.com>"
- **Design**: Purple to pink gradient matching your brand
- **Features**: Voice-to-task transformation preview
- **Tone**: Friendly and professional

## Testing

1. Make sure your `RESEND_API_KEY` is set in your environment
2. Submit a test email through your waitlist form
3. Check the terminal logs for:
   - `New waitlist signup saved to database: email@example.com`
   - `Confirmation email sent successfully: [email_data]`
4. Check your email inbox for the confirmation

## Error Handling

The email system is designed to be resilient:
- If email sending fails, the user is still added to the waitlist
- Email errors are logged but don't break the user experience
- Users see a success message regardless of email status

## Customization

To customize the email template, edit `/src/lib/email-templates.ts`:

- Change colors in the CSS gradient
- Update the feature list
- Modify the call-to-action button
- Add your social media links
- Update the footer content

## Production Checklist

- [ ] Set up custom domain in Resend
- [ ] Update the `from` address to use your domain
- [ ] Test with real email addresses
- [ ] Set up email analytics in Resend dashboard
- [ ] Configure unsubscribe handling
- [ ] Add SPF/DKIM records for better deliverability

## Troubleshooting

**Email not sending?**
- Check that `RESEND_API_KEY` is set correctly
- Verify the API key is active in Resend dashboard
- Check terminal logs for error messages

**Email going to spam?**
- Set up a custom domain
- Add SPF and DKIM records
- Avoid spam trigger words in content

**Domain not verified?**
- Add all required DNS records
- Wait for DNS propagation (can take 24-48 hours)
- Check domain status in Resend dashboard
