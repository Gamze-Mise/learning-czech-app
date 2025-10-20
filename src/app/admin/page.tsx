"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

export default function AdminPage() {
  const [showWarning, setShowWarning] = useState(false);

  const handleAdminAction = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="🚧 Admin Panel"
        subtitle="Administrative features are currently under development"
      />

      {/* Warning Message */}
      {showWarning && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-3">
            <div className="text-orange-500">⚠️</div>
            <div>
              <h3 className="font-semibold text-orange-800">
                Feature Not Available
              </h3>
              <p className="text-sm text-orange-700">
                Admin panel features are currently under development. Please
                check back later!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Coming Soon Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            Admin Panel Coming Soon
          </h2>
          <p className="text-blue-700 mb-6">
            We're working hard to bring you comprehensive admin features
            including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">📚</span>
                <span className="text-blue-800">Content Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">👥</span>
                <span className="text-blue-800">User Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">📊</span>
                <span className="text-blue-800">Analytics Dashboard</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🎯</span>
                <span className="text-blue-800">Exercise Builder</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🎴</span>
                <span className="text-blue-800">Flashcard Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">⚙️</span>
                <span className="text-blue-800">System Settings</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Admin Actions (Disabled) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Content Management
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">Manage Courses</h3>
              <p className="text-sm text-gray-500">
                Create, edit, and organize courses
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">Manage Lessons</h3>
              <p className="text-sm text-gray-500">
                Add and edit lesson content
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">Manage Flashcards</h3>
              <p className="text-sm text-gray-500">
                Create and organize flashcards
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">Manage Exercises</h3>
              <p className="text-sm text-gray-500">
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
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">View All Users</h3>
              <p className="text-sm text-gray-500">
                Browse and manage user accounts
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">User Analytics</h3>
              <p className="text-sm text-gray-500">
                View learning progress and statistics
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">Support Tickets</h3>
              <p className="text-sm text-gray-500">
                Handle user support requests
              </p>
            </button>
            <button
              onClick={handleAdminAction}
              className="w-full p-3 bg-gray-100 rounded-lg cursor-not-allowed text-left"
            >
              <h3 className="font-semibold text-gray-600">System Settings</h3>
              <p className="text-sm text-gray-500">
                Configure application settings
              </p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
