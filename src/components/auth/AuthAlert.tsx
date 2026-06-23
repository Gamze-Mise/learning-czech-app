type Props = {
  variant?: "error" | "success" | "warning";
  children: React.ReactNode;
  className?: string;
};

const variantClass = {
  error: "text-sm text-red-600 bg-red-50 p-3 rounded-lg",
  success: "text-sm text-green-700 bg-green-50 p-3 rounded-lg",
  warning: "text-sm text-amber-800 bg-amber-50 p-3 rounded-lg",
};

export default function AuthAlert({
  variant = "error",
  children,
  className = "",
}: Props) {
  return <p className={`${variantClass[variant]} ${className}`}>{children}</p>;
}
