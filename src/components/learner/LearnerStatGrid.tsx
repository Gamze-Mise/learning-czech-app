type StatTheme = "blue" | "green" | "purple" | "orange" | "yellow" | "gray";

type StatItem = {
  value: string | number;
  label: string;
  theme: StatTheme;
};

type Props = {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const themeClass: Record<StatTheme, { bg: string; value: string; label: string }> = {
  blue: { bg: "bg-blue-50", value: "text-blue-600", label: "text-blue-500" },
  green: { bg: "bg-green-50", value: "text-green-600", label: "text-green-500" },
  purple: { bg: "bg-purple-50", value: "text-purple-600", label: "text-purple-500" },
  orange: { bg: "bg-orange-50", value: "text-orange-600", label: "text-orange-500" },
  yellow: { bg: "bg-yellow-50", value: "text-yellow-600", label: "text-yellow-500" },
  gray: { bg: "bg-gray-50", value: "text-gray-600", label: "text-gray-500" },
};

const colClass = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export default function LearnerStatGrid({
  items,
  columns = 4,
  className = "",
}: Props) {
  return (
    <div className={`grid ${colClass[columns]} gap-4 text-center ${className}`}>
      {items.map((item) => {
        const t = themeClass[item.theme];
        return (
          <div key={item.label} className={`${t.bg} rounded-lg p-3`}>
            <div className={`text-xl font-bold ${t.value}`}>{item.value}</div>
            <div className={`text-xs ${t.label}`}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
