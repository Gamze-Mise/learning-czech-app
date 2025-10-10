export default function UnitPage({ params }: { params: { id: string } }) {
  const unitId = params.id;
  
  // Mock lessons data - later this will come from a database
  const lessons = [
    { id: 1, title: "Basic Greetings", progress: 100, type: "vocabulary" },
    { id: 2, title: "Numbers 1-10", progress: 80, type: "vocabulary" },
    { id: 3, title: "Present Tense", progress: 60, type: "grammar" },
    { id: 4, title: "Family Members", progress: 40, type: "vocabulary" },
    { id: 5, title: "Daily Activities", progress: 20, type: "conversation" },
  ];

  return (
    <div className="space-y-6">
      {/* Unit Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Unit {unitId}
        </h1>
        <p className="text-gray-600">
          Choose a lesson to continue your learning journey
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <a
            key={lesson.id}
            href={`/units/${unitId}/lessons/${lesson.id}`}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  lesson.type === 'vocabulary' ? 'bg-blue-500' :
                  lesson.type === 'grammar' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {lesson.type}
                </span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {lesson.progress}%
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {lesson.title}
            </h3>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${lesson.progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Lesson {lesson.id}
              </span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
