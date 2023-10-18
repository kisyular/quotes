import Navbar from './_components/navbar'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='h-full dark:bg-[#0b0b0b]'>
			<Navbar />
			<main className='h-full pt-40'>{children}</main>
		</div>
	)
}

export default MarketingLayout
