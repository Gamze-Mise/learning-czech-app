import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage courses, users, and system settings"
      />

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">2,567</div>
            <div className="text-sm text-gray-600">Total Lessons</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">89%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Content Management
          </h2>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <h3 className="font-semibold text-blue-800">Manage Courses</h3>
              <p className="text-sm text-blue-600">
                Create, edit, and organize courses
              </p>
            </button>
            <button className="w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <h3 className="font-semibold text-green-800">Manage Lessons</h3>
              <p className="text-sm text-green-600">
                Add and edit lesson content
              </p>
            </button>
            <button className="w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <h3 className="font-semibold text-purple-800">
                Manage Flashcards
              </h3>
              <p className="text-sm text-purple-600">
                Create and organize flashcards
              </p>
            </button>
            <button className="w-full p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <h3 className="font-semibold text-orange-800">
                Manage Exercises
              </h3>
              <p className="text-sm text-orange-600">
                Create quizzes and exercises
              </p>
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            User Management
          </h2>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <h3 className="font-semibold text-blue-800">View All Users</h3>
              <p className="text-sm text-blue-600">
                Browse and manage user accounts
              </p>
            </button>
            <button className="w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <h3 className="font-semibold text-green-800">User Analytics</h3>
              <p className="text-sm text-green-600">
                View learning progress and statistics
              </p>
            </button>
            <button className="w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <h3 className="font-semibold text-purple-800">Support Tickets</h3>
              <p className="text-sm text-purple-600">
                Handle user support requests
              </p>
            </button>
            <button className="w-full p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <h3 className="font-semibold text-orange-800">System Settings</h3>
              <p className="text-sm text-orange-600">
                Configure application settings
              </p>
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent System Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                New user registered: john_doe
              </p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Course "Basic Greetings" updated
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                50 new flashcards added
              </p>
              <p className="text-xs text-gray-500">3 hours ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
