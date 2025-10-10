export default function Home() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🇨🇿 Welcome to Czech Learning
        </h1>
        <p className="text-gray-600">
          Start your journey to master the Czech language
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard - Progress Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>

          {/* Progress Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Vocabulary</span>
                <span className="text-sm font-medium text-blue-600">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Grammar</span>
                <span className="text-sm font-medium text-blue-600">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Units Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Units</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((unit) => (
                <a
                  key={unit}
                  href={`/units/${unit}`}
                  className={`p-3 rounded-lg text-center text-sm font-medium transition-colors ${
                    unit === 1
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Unit {unit}
                </a>
              ))}
            </div>
          </div>

          <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Review
          </button>
        </div>

        {/* Dashboard - Recommended Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>

          {/* Recommended Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Recommended
            </h3>
            <div className="space-y-3">
              <a
                href="/units/3/lessons/2"
                className="block bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors"
              >
                <p className="text-sm text-blue-800 font-medium">Unit 3</p>
                <p className="text-xs text-blue-600">Lesson 2</p>
              </a>
              <a
                href="/grammar/present-tense"
                className="block bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors"
              >
                <p className="text-sm text-green-800 font-medium">Grammar</p>
                <p className="text-xs text-green-600">Present tense</p>
              </a>
            </div>
          </div>

          <a
            href="/units/3/lessons/2"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
}
