import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NewHeart - 현장 프로젝트 관리',
  description: '현장 프로젝트를 효율적으로 관리하는 MVP 웹앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
