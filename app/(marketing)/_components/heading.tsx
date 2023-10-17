'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Heading = () => {
	return (
		<div className='max-w-3xl space-y-4'>
			<h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
				Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
				<span className='underline'>Rotion</span>
			</h1>

			<h3 className='text-base sm:text-xl md:text-2xl font-medium'>
				Rotion is the connected workspace where <br />
				better, faster work happens.
			</h3>

			<Button asChild>
				<Link href='/documents'>
					Enter Jotion
					<ArrowRight className='h-4 w-4 ml-2' />
				</Link>
			</Button>
		</div>
	)
}
export default Heading
