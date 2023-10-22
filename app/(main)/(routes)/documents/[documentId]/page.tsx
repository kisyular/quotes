'use client'
import Toolbar from '@/components/toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'

interface DocumentIdPageProps {
	params: {
		documentId: Id<'documents'>
	}
}
const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
	const document = useQuery(api.documents.getById, {
		documentId: params.documentId,
	})

	if (document === undefined) {
		return (
			<div>
				<div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
					<div className='space-y-4 pl-8 pt-4'>Loading</div>
				</div>
			</div>
		)
	}

	if (document === null) {
		return (
			<div className='pb-40'>
				<div className='h-[35vh' />
				<div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
					Hello Hello
					<Toolbar initialData={document} />
				</div>
			</div>
		)
	}
	return (
		<div className='pb-40'>
			<div className='h-[35vh]' />
			<div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
				<Toolbar initialData={document} />
			</div>
		</div>
	)
}
export default DocumentIdPage
