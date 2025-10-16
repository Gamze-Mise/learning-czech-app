import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🇨🇿</span>
            <h1 className="text-lg sm:text-xl font-bold">Learning Czech</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/units"
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Units
            </Link>
            <Link
              href="/admin"
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Admin
            </Link>
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
  );
}
