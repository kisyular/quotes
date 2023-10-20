'use client'

import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import { SignInButton } from '@clerk/clerk-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'

const Heading = () => {
	const { isAuthenticated, isLoading } = useConvexAuth()

	return (
		<div className='max-w-4xl space-y-4'>
			<h1 className='text-3xl sm:text-5xl md:text-7xl font-bold'>
				Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
				<span className='underline'>Quotes</span>
			</h1>
			<h3 className='text-base sm:text-xl md:text-2xl font-medium'>
				Quotes is the connected workspace where <br />
				better, faster work happens.
			</h3>
			{isLoading && (
				<div className='w-full flex items-center justify-center'>
					<Spinner size='lg' />
				</div>
			)}
			{isAuthenticated && !isLoading && (
				<Button asChild>
					<Link href='/documents'>
						Enter Quotes
						<ArrowRight className='h-4 w-4 ml-2' />
					</Link>
				</Button>
			)}
			{!isAuthenticated && !isLoading && (
				<SignInButton mode='modal'>
					<Button>
						Get Quotes free
						<ArrowRight className='h-4 w-4 ml-2' />
					</Button>
				</SignInButton>
			)}
		</div>
	)
}

export default Heading
