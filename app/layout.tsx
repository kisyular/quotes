import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Notion',
	description: 'A personal note taker app build with Next JS',
	icons: {
		icon: [
			{
				media: '(prefers-color-scheme: light)',
				url: '/logo-white.png',
				href: '/logo-white.png',
			},
			{
				media: '(prefers-color-scheme: dark)',
				url: '/logo-black.png',
				href: '/logo-black.png',
			},
		],
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
