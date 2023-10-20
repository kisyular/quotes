import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Quotes',
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
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<ConvexClientProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
						storageKey='jotion-theme-2'
					>
						{children}
					</ThemeProvider>
				</ConvexClientProvider>
			</body>
		</html>
	)
}
