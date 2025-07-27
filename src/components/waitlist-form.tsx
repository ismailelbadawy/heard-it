'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useWaitlist } from '@/hooks/use-waitlist'

interface WaitlistFormProps {
  className?: string
  size?: 'default' | 'lg'
  variant?: 'hero' | 'cta'
}

export function WaitlistForm({ className = '', size = 'lg', variant = 'hero' }: WaitlistFormProps) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const { submitWaitlist, isPending } = useWaitlist()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult(null)

    const formData = new FormData(event.currentTarget)
    const result = await submitWaitlist(formData)
    
    setResult(result)
    
    if (result.success) {
      // Reset form on success
      event.currentTarget.reset()
    }
  }

  const isHeroVariant = variant === 'hero'
  const buttonClasses = isHeroVariant 
    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
    : "w-full sm:w-auto"

  const inputClasses = isHeroVariant 
    ? "flex-1"
    : "max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"

  return (
    <div className={`w-full max-w-md space-y-2 px-4 sm:px-0 ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input 
          type="email" 
          name="email"
          placeholder="Enter your email" 
          className={inputClasses}
          required 
          disabled={isPending}
        />
        <Button
          type="submit"
          size={size}
          className={buttonClasses}
          disabled={isPending}
          variant={isHeroVariant ? 'default' : 'secondary'}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              {isHeroVariant ? (
                <Mic className="mr-2 h-4 w-4" />
              ) : null}
              {isHeroVariant ? 'Join Waitlist' : 'Get Started'}
              {!isHeroVariant ? (
                <ArrowRight className="ml-2 h-4 w-4" />
              ) : null}
            </>
          )}
        </Button>
      </form>
      
      {/* Status message */}
      {result && (
        <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${
          result.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}
      
      {/* Helper text */}
      {!result && (
        <p className={`text-xs text-center ${
          isHeroVariant ? 'text-muted-foreground' : 'text-purple-100'
        }`}>
          {isHeroVariant 
            ? 'Be the first to know when HeardIt launches'
            : 'Start your free trial. No credit card required.'
          }
        </p>
      )}
    </div>
  )
}
