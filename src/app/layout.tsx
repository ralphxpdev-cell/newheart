import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '새마음건축 - 현장 프로젝트 관리',
  description: '새마음건축 현장 프로젝트 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
