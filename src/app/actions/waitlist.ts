'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

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

      // TODO: Add additional integrations here:
      // await addToEmailList(email) // Mailchimp, ConvertKit, etc.
      // await sendConfirmationEmail(email)

      return {
        success: true,
        message: `Thanks for joining! We'll notify you at ${email} when HeardIt launches.`
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
