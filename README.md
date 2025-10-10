# 🇨🇿 Czech Learning App

A comprehensive Czech language learning application built with Next.js, TypeScript, and Tailwind CSS. This interactive platform helps users master Czech through structured lessons, flashcards, quizzes, and engaging exercises.

## 🚀 Features (Planned)

### 📚 Learning Modules

- **Structured Lessons**: Progressive curriculum from beginner to advanced levels
- **Grammar Focus**: Comprehensive Czech grammar explanations and exercises
- **Vocabulary Building**: Themed vocabulary sets with audio pronunciation
- **Cultural Context**: Learn Czech through cultural insights and real-world examples

### 🎯 Interactive Learning Tools

- **Flashcards**: Spaced repetition system for effective memorization
- **Quizzes**: Multiple choice, fill-in-the-blank, and listening comprehension tests
- **Progress Tracking**: Visual progress indicators and achievement badges
- **Adaptive Learning**: Personalized difficulty adjustment based on performance

### 🎵 Audio & Pronunciation

- **Native Speaker Audio**: High-quality pronunciation examples
- **Speech Recognition**: Practice speaking with feedback
- **Phonetic Guides**: IPA transcriptions for accurate pronunciation

### 📊 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Customizable interface themes
- **Offline Support**: Continue learning without internet connection
- **Multi-language Interface**: Support for English, Turkish, and other languages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand (planned)
- **Database**: PostgreSQL / Supabase (planned)
- **Authentication**: NextAuth.js (planned)
- **Audio**: Web Speech API / External TTS service (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/learning-czech-app.git
cd learning-czech-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # User dashboard
│   ├── lessons/           # Lesson pages
│   ├── flashcards/        # Flashcard interface
│   ├── quizzes/           # Quiz pages
│   └── profile/           # User profile
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── learning/         # Learning-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── data/                 # Static data and content
```

## 🎯 Development Roadmap

### Phase 1: Core Foundation

- [ ] Basic lesson structure and navigation
- [ ] Flashcard system implementation
- [ ] Simple quiz functionality
- [ ] User progress tracking

### Phase 2: Enhanced Learning

- [ ] Audio integration and pronunciation
- [ ] Advanced quiz types
- [ ] Spaced repetition algorithm
- [ ] Achievement system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Czech language experts and native speakers
- Open source community
- Educational technology inspiration from Duolingo, Anki, and other language learning platforms

---

**Happy Learning! Šťastné učení! 🎉**
