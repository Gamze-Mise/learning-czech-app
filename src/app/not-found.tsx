import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50 text-slate-900">
      <p className="text-sm font-medium text-slate-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-center text-slate-600 text-sm leading-relaxed">
        This URL does not match a page on this site.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
      >
        Go to home
      </Link>
    </div>
  );
}
