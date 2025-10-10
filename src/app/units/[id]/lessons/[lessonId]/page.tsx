export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: unitId, lessonId } = await params;

  // Mock lesson data - later this will come from a database
  const lessonData = {
    1: {
      title: "Basic Greetings",
      type: "vocabulary",
      content: {
        words: [
          { czech: "dobrý", english: "good", audio: "/audio/dobry.mp3" },
          { czech: "den", english: "day", audio: "/audio/den.mp3" },
          { czech: "ahoj", english: "hello", audio: "/audio/ahoj.mp3" },
        ],
      },
    },
    2: {
      title: "Numbers 1-10",
      type: "vocabulary",
      content: {
        words: [
          { czech: "jeden", english: "one", audio: "/audio/jeden.mp3" },
          { czech: "dva", english: "two", audio: "/audio/dva.mp3" },
          { czech: "tři", english: "three", audio: "/audio/tri.mp3" },
        ],
      },
    },
    3: {
      title: "Present Tense",
      type: "grammar",
      content: {
        dialogue: [
          {
            speaker: "A",
            czech: "Ahoj! Jak se máš?",
            english: "Hi! How are you?",
          },
          {
            speaker: "B",
            czech: "Ahoj! Mám se dobře.",
            english: "Hi! I'm fine.",
          },
        ],
      },
    },
  };

  const lesson =
    lessonData[lessonId as keyof typeof lessonData] || lessonData[1];

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {lesson.title}
        </h1>
        <p className="text-gray-600">
          Unit {unitId} • Lesson {lessonId}
        </p>
      </div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Vocabulary Panel */}
        {lesson.type === "vocabulary" && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vocabulary</h2>

            <div className="space-y-4">
              {lesson.content.words?.map((word, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 text-center"
                >
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {word.czech}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {word.english}
                  </div>
                  <button className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-700 transition-colors mx-auto">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        )}

        {/* Grammar/Dialogue Panel */}
        {lesson.type === "grammar" && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Text & Audio
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {lesson.content.dialogue?.map((line, index) => (
                <div key={index} className="text-sm">
                  <span
                    className={`font-medium ${
                      line.speaker === "A" ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {line.speaker}:
                  </span>{" "}
                  {line.czech}
                  <div className="text-xs text-gray-500 mt-1">
                    {line.english}
                  </div>
                </div>
              ))}

              <button className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors mt-4">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Continue
            </button>
          </div>
        )}

        {/* Progress Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Progress</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">This Lesson</span>
                <span className="text-sm font-medium text-blue-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Unit {unitId}</span>
                <span className="text-sm font-medium text-green-600">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <a
              href={`/units/${unitId}`}
              className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Back to Unit
            </a>
            <a
              href="/"
              className="block w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
