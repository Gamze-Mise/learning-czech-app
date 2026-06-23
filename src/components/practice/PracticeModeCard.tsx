import Card from "@/components/Card";
import Button from "@/components/Button";

type PracticeModeCardProps = {
  title: string;
  description: string;
  count: number;
  countLabel: string;
  href: string;
  buttonLabel: string;
  iconBgClass: string;
  iconColorClass: string;
  icon: React.ReactNode;
};

export default function PracticeModeCard({
  title,
  description,
  count,
  countLabel,
  href,
  buttonLabel,
  iconBgClass,
  iconColorClass,
  icon,
}: PracticeModeCardProps) {
  return (
    <Card>
      <div className="text-center">
        <div
          className={`w-16 h-16 ${iconBgClass} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <div className={`w-8 h-8 ${iconColorClass}`}>{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-gray-500 mb-4">
          {count} {countLabel}
        </div>
        <Button href={href} variant="primary" size="lg" className="w-full">
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
}
