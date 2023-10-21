import { cn } from '@/lib/utils'
import {
	ChevronsLeft,
	MenuIcon,
	PlusCircle,
	Search,
	Settings,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './user-item'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Item from './item'
import { toast } from 'sonner'

const Navigation = () => {
	const pathname = usePathname()
	const isMobile = useMediaQuery('(max-width: 768px)')

	const isResizingRef = useRef(false)
	const sidebarRef = useRef<ElementRef<'aside'>>(null)
	const navbarRef = useRef<ElementRef<'div'>>(null)
	const [isResetting, setIsResetting] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(isMobile)
	const create = useMutation(api.documents.create)
	const router = useRouter()

	useEffect(() => {
		if (isMobile) {
			collapse()
		} else {
			resetWidth()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile])

	useEffect(() => {
		if (isMobile) {
			collapse()
		}
	}, [pathname, isMobile])

	// This function handles the event when the mouse button is pressed down
	const handleMouseDown = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		// Prevent the default behavior of the event and stop it from propagating up the DOM tree
		event.preventDefault()
		event.stopPropagation()

		// Set the isResizingRef to true indicating that resizing has started
		isResizingRef.current = true
		// Add event listeners for mousemove and mouseup events
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	// This function handles the event when the mouse is moved
	const handleMouseMove = (event: MouseEvent) => {
		// If resizing is not in progress, exit the function
		if (!isResizingRef.current) return

		// Get the new width based on the mouse's x-coordinate
		let newWidth = event.clientX

		// Set the minimum and maximum width for the sidebar
		if (newWidth < 240) newWidth = 240
		if (newWidth > 480) newWidth = 480

		// If the sidebar and navbar references exist, adjust their styles
		if (sidebarRef.current && navbarRef.current) {
			// Set the width of the sidebar to the new width
			sidebarRef.current.style.width = `${newWidth}px`
			// Set the left property of the navbar to the new width
			navbarRef.current.style.setProperty('left', `${newWidth}px`)
			// Set the width of the navbar to the remaining width
			navbarRef.current.style.setProperty(
				'width',
				`calc(100% - ${newWidth}px)`
			)
		}
	}

	const handleMouseUp = () => {
		isResizingRef.current = false
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	}

	const resetWidth = () => {
		// Check if the sidebar and navbar references exist
		if (sidebarRef.current && navbarRef.current) {
			// Set the isCollapsed state to false and the isResetting state to true
			setIsCollapsed(false)
			setIsResetting(true)

			// Adjust the width of the sidebar based on whether the device is mobile or not
			sidebarRef.current.style.width = isMobile ? '100%' : '240px'
			// Adjust the width of the navbar based on whether the device is mobile or not
			navbarRef.current.style.setProperty(
				'width',
				isMobile ? '0' : 'calc(100% - 240px)'
			)
			// Adjust the left property of the navbar based on whether the device is mobile or not
			navbarRef.current.style.setProperty(
				'left',
				isMobile ? '100%' : '240px'
			)
			// After 300 milliseconds, set the isResetting state back to false
			setTimeout(() => setIsResetting(false), 300)
		}
	}

	const collapse = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(true)
			setIsResetting(true)

			sidebarRef.current.style.width = '0'
			navbarRef.current.style.setProperty('width', '100%')
			navbarRef.current.style.setProperty('left', '0')
			setTimeout(() => setIsResetting(false), 300)
		}
	}

	const handleCreate = () => {
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
		<>
			<aside
				ref={sidebarRef}
				className={cn(
					'group/sidebar h-full bg-[#0b0b0b] overflow-y-auto relative flex w-60 flex-col z-[99999]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'w-0'
				)}
			>
				<div
					role='button'
					onClick={collapse}
					className={cn(
						'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
						isMobile && 'opacity-100'
					)}
				>
					<ChevronsLeft className='h-6 w-6' />
				</div>
				<div>
					<UserItem />
					<Item
						onClick={() => {}}
						label='Search'
						isSearch
						icon={Search}
					/>
					<Item onClick={() => {}} label='Settings' icon={Settings} />
					<Item
						onClick={handleCreate}
						label='New page'
						icon={PlusCircle}
					/>
				</div>
				<div className='mt-4'></div>
				<div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
				/>
			</aside>
			<div
				ref={navbarRef}
				className={cn(
					'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'left-0 w-full'
				)}
			>
				<nav className='bg-transparent px-3 py-2 w-full'>
					{isCollapsed && (
						<MenuIcon
							onClick={resetWidth}
							role='button'
							className='h-6 w-6 text-muted-foreground'
						/>
					)}
				</nav>
			</div>
		</>
	)
}
export default Navigation
