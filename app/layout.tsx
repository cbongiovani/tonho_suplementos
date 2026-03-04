import type { Metadata } from 'next'
import './globals.css'
import { FloatingInstagram } from '@/components/domain/FloatingInstagram'

export const metadata: Metadata = {
  title: 'Tonho Suplementos | Resultados de verdade',
  description: 'Suplementos originais para quem leva treino a sério.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
        <FloatingInstagram />
      </body>
    </html>
  )
}
