type Props = {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-12 w-12",
};

export default function PageLoadingSpinner({
  message,
  size = "md",
  className = "",
}: Props) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClass[size]}`}
      />
      {message ? <p className="text-gray-600 mt-4">{message}</p> : null}
    </div>
  );
}
