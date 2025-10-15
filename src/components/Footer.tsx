export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kolon - Logo ve Açıklama */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🇨🇿</span>
              <h3 className="text-lg font-bold">Czech Learning App</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Master Czech language with interactive lessons, flashcards, and
              quizzes.
            </p>
          </div>

          {/* Orta Kolon - Hızlı Linkler */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/units/1"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Units
                </a>
              </li>
            </ul>
          </div>

          {/* Sağ Kolon - İletişim */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>

        {/* Alt Çizgi ve Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; 2025 Czech Learning App. Happy Learning! Šťastné učení! 🎉
          </p>
        </div>
      </div>
    </footer>
  );
}
