'use client'

import { useTransition } from 'react'
import { joinWaitlist, WaitlistResult } from '@/app/actions/waitlist'

export function useWaitlist() {
    const [isPending, startTransition] = useTransition()

    const submitWaitlist = async (formData: FormData): Promise<WaitlistResult> => {
        return new Promise((resolve) => {
            startTransition(async () => {
                const result = await joinWaitlist(formData)
                resolve(result)
            })
        })
    }

    return {
        submitWaitlist,
        isPending
    }
}
