import Link from "next/link";

interface CardProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  href,
  className = "",
  hover = true,
}: CardProps) {
  const baseClasses = "bg-white rounded-xl shadow-lg p-4 sm:p-6";
  const hoverClasses = hover
    ? "hover:shadow-xl transition-shadow duration-300"
    : "";

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  if (href) {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <div className={classes}>{children}</div>;
}
