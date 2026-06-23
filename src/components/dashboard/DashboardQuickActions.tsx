import Card from "@/components/Card";
import Button from "@/components/Button";

type Props = {
  onRefresh: () => void;
};

export default function DashboardQuickActions({ onRefresh }: Props) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          href="/"
          className="p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors text-left"
        >
          <h3 className="font-semibold text-blue-900">Continue Learning</h3>
          <p className="text-sm text-blue-800">Resume your current lesson</p>
        </Button>
        <Button
          href="/units"
          className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
        >
          <h3 className="font-semibold text-green-800">Browse Units</h3>
          <p className="text-sm text-green-600">Explore all available lessons</p>
        </Button>
        <Button
          onClick={onRefresh}
          className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
        >
          <h3 className="font-semibold text-purple-800">Refresh Stats</h3>
          <p className="text-sm text-purple-600">Update your progress</p>
        </Button>
      </div>
    </Card>
  );
}
