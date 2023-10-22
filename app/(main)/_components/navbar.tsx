'use client'

import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MenuIcon } from 'lucide-react'
import { Title } from './title'

interface NavbarProps {
	isCollapsed: boolean
	onResetWidth: () => void
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
	const params = useParams()

	const document = useQuery(api.documents.getById, {
		documentId: params.documentId as Id<'documents'>,
	})

	if (document === undefined) {
		return (
			<nav className='bg-background bg-[#eaeaea] dark:bg-[#0B0B0B] px-3 py-2 w-full flex items-center justify-between'>
				<Title.Skeleton />
				<div className='flex items-center gap-x-2'>Loading Menu</div>
			</nav>
		)
	}

	if (document === null) {
		return null
	}
	return (
		<>
			<nav className='bg-background bg-[#eaeaea] dark:bg-[#0B0B0B] px-3 py-2 w-full flex items-center gap-x-4'>
				{isCollapsed && (
					<MenuIcon
						role='button'
						onClick={onResetWidth}
						className='h-6 w-6 text-muted-foreground'
					/>
				)}
				<div className='flex items-center justify-between w-full'>
					<Title initialData={document} />
					<div className='flex items-center gap-x-2'>Hello</div>
				</div>
			</nav>
			{document.isArchived && <p>{document._id} </p>}
		</>
	)
}
export default Navbar
