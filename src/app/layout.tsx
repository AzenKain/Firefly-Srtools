import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { ClientThemeWrapper, ThemeProvider } from "@/components/themeController";
import Footer from "@/components/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ToastContainer } from 'react-toastify';
import AvatarBar from "@/components/avatarBar";
import ActionBar from "@/components/actionBar";
import QueryProviderWrapper from "@/components/queryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firefly SrTools",
  description: "SrTools by Kain",
  icons: {
    icon: "/ff-srtool.png",
    shortcut: "/ff-srtool.ico",
    apple: "/ff-srtool.png",
  },
  openGraph: {
    title: "Firefly SrTools",
    description: "SrTools by Kain",
    url: "https://srtools.kain.id.vn",
    siteName: "Firefly SrTools",
    images: [
      {
        url: "https://srtools.kain.id.vn/ff-srtool.png",
        width: 1200,
        height: 630,
        alt: "Firefly SrTools Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Firefly SrTools",
    description: "SrTools by Kain",
    images: ["https://srtools.kain.id.vn/ff-srtool.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProviderWrapper>
            <ThemeProvider>
              <ClientThemeWrapper>
                <div className="min-h-screen w-full">
                  <Header />
                  <div className="grid grid-cols-12 w-full">
                    <div className="col-span-3 sticky top-0 self-start h-fit">
                      <AvatarBar />
                    </div>
                    <div className="col-span-9">
                      <ActionBar />
                      {children}

                    </div>
                  </div>
                  <Footer />
                </div>

              </ClientThemeWrapper>
            </ThemeProvider>
          </QueryProviderWrapper>
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
