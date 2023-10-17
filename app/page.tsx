import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
	return (
		<>
			<h1 className='font-bold text-3xl text-red-500'>Hello World</h1>
			<Button variant='destructive' size='lg'>
				Delete
			</Button>
		</>
	)
}
