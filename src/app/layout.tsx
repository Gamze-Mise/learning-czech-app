import type { Metadata } from "next";
import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
