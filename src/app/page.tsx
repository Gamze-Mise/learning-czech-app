export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 lg:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          🇨🇿 Learn Czech
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
          Master the Czech language with interactive lessons, flashcards, and
          quizzes. Learn effectively and have fun while progressing!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base">
            Start Learning
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="text-center p-6 lg:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl lg:text-5xl mb-4">📚</div>
            <h3 className="text-lg lg:text-xl font-semibold mb-3">
              Structured Lessons
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Progress step by step from beginner to advanced levels
            </p>
          </div>

          <div className="text-center p-6 lg:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl lg:text-5xl mb-4">🃏</div>
            <h3 className="text-lg lg:text-xl font-semibold mb-3">
              Flashcards
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Memorize vocabulary effectively with spaced repetition
            </p>
          </div>

          <div className="text-center p-6 lg:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="text-4xl lg:text-5xl mb-4">🎯</div>
            <h3 className="text-lg lg:text-xl font-semibold mb-3">Quizzes</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Test your knowledge and track your progress
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Why Learn Czech?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              10M+
            </div>
            <p className="text-gray-600 font-medium">
              Czech speakers worldwide
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              EU
            </div>
            <p className="text-gray-600 font-medium">Official EU language</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md sm:col-span-2 lg:col-span-1">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-3">
              1000+
            </div>
            <p className="text-gray-600 font-medium">Vocabulary words</p>
          </div>
        </div>
      </section>
    </div>
  );
}
