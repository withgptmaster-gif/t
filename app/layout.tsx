import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Simple Memo",
  description: "세상에서 가장 간단한 웹 메모장",
}

export const viewport: Viewport = {
  themeColor: "#f8f9fa",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans`}>{children}</body>
    </html>
  )
}
