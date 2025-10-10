export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          🇨🇿 Çekçe Öğren
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Etkileşimli dersler, flashcard'lar ve quiz'ler ile Çekçe dilini
          öğrenin. Eğlenceli ve etkili bir şekilde ilerleyin!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Derslere Başla
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Demo İzle
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">
            Yapılandırılmış Dersler
          </h3>
          <p className="text-gray-600">
            Başlangıçtan ileri seviyeye kadar adım adım ilerleyin
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🃏</div>
          <h3 className="text-xl font-semibold mb-2">Flashcard'lar</h3>
          <p className="text-gray-600">
            Spaced repetition ile kelimeleri etkili şekilde ezberleyin
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Quiz'ler</h3>
          <p className="text-gray-600">
            Bilginizi test edin ve ilerlemenizi takip edin
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Neden Çekçe Öğrenmelisiniz?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
            <p className="text-gray-600">Çekçe konuşan kişi</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <p className="text-gray-600">Kelime hazinesi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
