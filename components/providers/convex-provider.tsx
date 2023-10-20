'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

//use https://docs.convex.dev/auth/clerk
// This component is a provider for the Convex client.
// It uses the Clerk provider for authentication.
// The Clerk provider requires a publishable key, which is provided as an environment variable.
// The Convex provider is wrapped with the Clerk provider, and the useAuth hook from Clerk is passed to it.
// The Convex client is also passed to the Convex provider.
// The children prop is any React nodes that this provider will wrap.
export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
		>
			<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
				{children}
			</ConvexProviderWithClerk>
		</ClerkProvider>
	)
}
