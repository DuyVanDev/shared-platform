import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ReactNode } from "react";
import { getMessages } from "next-intl/server";
type Props = {
  children: React.ReactNode;
  params: { locale: string };
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "violet",
};
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Shared Platform - Chia sẻ & Quản lý Code Snippet",
  description:
    "Nền tảng chia sẻ, lưu trữ và quản lý các đoạn mã nguồn (code snippet) cho lập trình viên. Hỗ trợ đa ngôn ngữ, tìm kiếm, phân loại, bảo mật và cộng đồng.",
  keywords: [
    "code snippet",
    "chia sẻ mã nguồn",
    "lập trình",
    "shared platform",
    "quản lý code",
    "developer",
    "programming",
    "javascript",
    "python",
    "typescript",
    "react",
  ],
  authors: [
    {
      name: "Shared Platform Team",
      url: "https://shared-platform-qpqf.vercel.app/",
    },
  ],
  creator: "Shared Platform Team",
  robots: "index, follow",
  openGraph: {
    title: "Shared Platform - Chia sẻ & Quản lý Code Snippet",
    description:
      "Nền tảng chia sẻ, lưu trữ và quản lý các đoạn mã nguồn cho lập trình viên.",
    url: "https://shared-platform-qpqf.vercel.app/",
    siteName: "Shared Platform",
    images: [
      {
        url: "https://shared-platform-qpqf.vercel.app//og-image.png",
        width: 1200,
        height: 630,
        alt: "Shared Platform",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shared Platform - Chia sẻ & Quản lý Code Snippet",
    description:
      "Nền tảng chia sẻ, lưu trữ và quản lý các đoạn mã nguồn cho lập trình viên.",
    images: ["https://shared-platform-qpqf.vercel.app//og-image.png"],
    creator: "@sharedplatform",
  },
};
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: any; // 👈 Cho phép Next truyền bất kỳ dạng params nào mà không lỗi
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale || "vi"}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ToastProvider>
              <Header />
              {children}
            </ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
