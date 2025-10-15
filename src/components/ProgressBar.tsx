interface ProgressBarProps {
  label: string;
  percentage: number;
  color?: "blue" | "green" | "purple";
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  label,
  percentage,
  color = "blue",
  showPercentage = true,
  className = "",
}: ProgressBarProps) {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
  };

  const textColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">{label}</span>
        {showPercentage && (
          <span className={`text-sm font-medium ${textColorClasses[color]}`}>
            {percentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
