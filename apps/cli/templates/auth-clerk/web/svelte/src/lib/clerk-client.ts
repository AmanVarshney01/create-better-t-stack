import { Clerk } from '@clerk/clerk-js'
import { VITE_CLERK_PUBLISHABLE_KEY } from '$env/static/public'

if (!VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

export const clerk = new Clerk(VITE_CLERK_PUBLISHABLE_KEY)
