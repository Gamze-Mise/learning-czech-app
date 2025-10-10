import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Czech Learning App",
  description:
    "Learn Czech language with interactive lessons, flashcards, and quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇨🇿</span>
                <h1 className="text-xl font-bold">Czech Learning App</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="hover:text-blue-200 transition-colors">
                  Ana Sayfa
                </a>
                <a
                  href="/units"
                  className="hover:text-blue-200 transition-colors"
                >
                  Üniteler
                </a>
                <a
                  href="/dashboard"
                  className="hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/admin"
                  className="hover:text-blue-200 transition-colors"
                >
                  Admin
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>
              &copy; 2025 Czech Learning App. Happy Learning! Šťastné učení! 🎉
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
