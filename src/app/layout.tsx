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
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
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
        <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇨🇿</span>
                <h1 className="text-lg sm:text-xl font-bold">
                  Czech Learning App
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  Home
                </a>
                <a
                  href="/units"
                  className="hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  Units
                </a>
                <a
                  href="/dashboard"
                  className="hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/admin"
                  className="hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  Admin
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🇨🇿</span>
                  <h3 className="text-lg font-bold">Czech Learning App</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Master Czech language with interactive lessons, flashcards,
                  and quizzes.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/units"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Units
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Admin
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <p className="text-gray-300 text-sm">
                  Need help? Contact our support team for assistance.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-300 text-sm">
                &copy; 2025 Czech Learning App. Happy Learning! Šťastné učení!
                🎉
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
