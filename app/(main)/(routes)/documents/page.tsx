'use client'

import Image from 'next/image'
import { useUser } from '@clerk/clerk-react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

const DocumentsPage = () => {
	const { user } = useUser()
	const router = useRouter()

	const create = useMutation(api.documents.create)

	const onCreate = () => {
		const promise = create({ title: 'Untitled' }).then((documentId) =>
			router.push(`/documents/${documentId}`)
		)

		toast.promise(promise, {
			loading: 'Creating a new quote...',
			success: 'New quote created!',
			error: 'Failed to create a new quote.',
		})
	}

	return (
		<div className='h-full flex flex-col items-center justify-center space-y-4'>
			<Image
				src='/empty.png'
				height='300'
				width='300'
				alt='Empty'
				className='dark:hidden'
			/>
			<Image
				src='/empty-dark.png'
				height='300'
				width='300'
				alt='Empty'
				className='hidden dark:block'
			/>
			<h2 className='text-lg font-medium'>
				Welcome to {user?.firstName}&apos;s Quotes
			</h2>
			<Button onClick={onCreate}>
				<PlusCircle className='h-6 w-6 mr-2' />
				Create a quote
			</Button>
		</div>
	)
}

export default DocumentsPage
