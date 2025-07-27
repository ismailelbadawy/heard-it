'use server'

import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { renderWaitlistConfirmationEmail } from '@/lib/email-templates'

export interface WaitlistFormData {
  email: string
}

export interface WaitlistResult {
  success: boolean
  message: string
  error?: string
}

export async function joinWaitlist(formData: FormData): Promise<WaitlistResult> {
  try {
    const email = formData.get('email') as string
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Validate email
    if (!email) {
      return {
        success: false,
        message: 'Email is required',
        error: 'MISSING_EMAIL'
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        error: 'INVALID_EMAIL'
      }
    }

    // Save to database using Prisma
    try {
      await prisma.waitlist.create({
        data: {
          email: email.toLowerCase().trim(),
          status: 'pending'
        }
      })

      console.log(`New waitlist signup saved to database: ${email}`)

      // Send confirmation email
      try {
        const { data, error } = await resend.emails.send({
          from: 'HeardIt <waitlist@heardit.com>',
          to: [email],
          subject: 'Welcome to HeardIt Waitlist! 🎉',
          html: renderWaitlistConfirmationEmail(email),
        });

        if (error) {
          console.error('Email sending error:', error);
          // Don't fail the entire operation if email fails
        } else {
          console.log('Confirmation email sent successfully:', data);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire operation if email fails
      }

      // TODO: Add additional integrations here:
      // await addToEmailList(email) // Mailchimp, ConvertKit, etc.

      return {
        success: true,
        message: `Thanks for joining! We've sent a confirmation email to ${email}. Check your inbox for next steps! 📧`
      }

    } catch (dbError: any) {
      // Handle duplicate email (unique constraint violation)
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('email')) {
        return {
          success: false,
          message: 'This email is already on our waitlist!',
          error: 'DUPLICATE_EMAIL'
        }
      }
      
      // Re-throw for general error handling
      throw dbError
    }

  } catch (error) {
    console.error('Waitlist signup error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      error: 'SERVER_ERROR'
    }
  }
}

// Alternative version that redirects (uncomment if you prefer this approach)
/*
export async function joinWaitlistWithRedirect(formData: FormData) {
  const result = await joinWaitlist(formData)
  
  if (result.success) {
    redirect('/thank-you')
  } else {
    redirect(`/?error=${encodeURIComponent(result.message)}`)
  }
}
*/
