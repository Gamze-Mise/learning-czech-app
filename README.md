# 🇨🇿 Czech Learning App

A comprehensive Czech language learning application built with Next.js 15, TypeScript, and Tailwind CSS. This interactive platform helps users master Czech through structured lessons, flashcards, and engaging exercises with a complete spaced repetition system.

## ✨ Current Features

### 📚 Complete Learning System

- **Structured Course**: Full Unit 1 "Basic Greetings" with 4 comprehensive lessons
- **Interactive Lessons**: Text content, audio pronunciation, video materials, and vocabulary
- **Flashcard System**: Spaced repetition algorithm with difficulty-based scheduling
- **Exercise Types**: Multiple choice, fill-in-the-blank, and interactive matching exercises
- **Progress Tracking**: Visual progress indicators and completion tracking

### 🎯 Interactive Learning Tools

- **Smart Flashcards**: SRS-based learning with automatic difficulty adjustment
- **Diverse Exercises**: MCQ, fill-in-the-blank, and drag-and-drop matching
- **Audio Integration**: Native speaker pronunciation with playback controls
- **Seamless Navigation**: Automatic progression through exercises and lessons
- **Completion Tracking**: Full lesson and unit completion system

### 📱 User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Feedback**: Instant exercise results and explanations
- **Smooth Navigation**: Client-side routing with Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **State Management**: React Hooks (useState, useEffect)
- **Audio**: HTML5 Audio API
- **Deployment Ready**: Vercel-optimized configuration

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)

### Quick Start

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/learning-czech-app.git
cd learning-czech-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up the database:**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with Czech course data
node prisma/seed.js
```

4. **Start the development server:**

```bash
npm run dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start learning Czech!

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run database migrations
node prisma/seed.js  # Seed database with course data
npx prisma studio    # Open Prisma Studio (database GUI)

# Data Import
npm run import:flashcards  # Import additional flashcards from JSON
```

## 📁 Project Structure

```
learning-czech-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with header/footer
│   │   ├── page.tsx            # Home page with course overview
│   │   ├── dashboard/          # User dashboard
│   │   ├── units/              # Course units
│   │   │   ├── page.tsx        # Units overview
│   │   │   └── [id]/           # Dynamic unit pages
│   │   │       ├── page.tsx    # Unit detail page
│   │   │       └── lessons/    # Lesson system
│   │   │           └── [lessonId]/
│   │   │               ├── page.tsx      # Lesson content
│   │   │               ├── practice/     # Practice mode
│   │   │               ├── flashcards/   # Flashcard practice
│   │   │               └── exercises/    # Exercise system
│   │   │                   ├── page.tsx  # Exercise list
│   │   │                   └── [exerciseId]/
│   │   │                       └── page.tsx # Individual exercises
│   │   └── api/                # API routes
│   │       ├── exercises/      # Exercise data endpoints
│   │       ├── flashcards/     # Flashcard data endpoints
│   │       ├── lessons/        # Lesson data endpoints
│   │       └── users/          # User progress endpoints
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Site navigation
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Button.tsx          # Interactive button component
│   │   ├── Card.tsx            # Content card component
│   │   ├── ProgressBar.tsx     # Progress visualization
│   │   └── PageHeader.tsx      # Page title component
│   └── lib/                    # Utility functions
│       ├── prisma.ts           # Database client
│       └── srs.ts              # Spaced repetition algorithm
├── prisma/
│   ├── schema.prisma           # Complete database schema
│   ├── seed.js                 # Full course data seeding
│   ├── dev.db                  # SQLite database
│   └── migrations/             # Database migration history
├── public/
│   ├── images/                 # Flashcard images
│   └── uploads/                # Audio files
├── data/
│   └── sample-flashcards.json  # Additional flashcard data
├── scripts/
│   └── import-flashcards.ts    # Data import utilities
└── docs/
    ├── DB_SCHEMA.md            # Database documentation
    └── PROJECT_PLAN.md         # Development roadmap
```

## 🎯 Current Implementation Status

### ✅ Completed Features

- **Complete Unit 1**: "Basic Greetings" with 4 full lessons
- **Lesson System**: Text, audio, video, and vocabulary content
- **Flashcard Practice**: Full SRS implementation with progress tracking
- **Exercise Types**: MCQ, fill-in-the-blank, and interactive matching
- **Navigation Flow**: Seamless progression through content
- **Audio Integration**: Pronunciation playback system
- **Progress Tracking**: Lesson and exercise completion
- **Responsive Design**: Mobile-friendly interface
- **Database Schema**: Complete course structure
- **API Endpoints**: Full REST API for all features

### 🎓 Learning Content

**Unit 1: Basic Greetings**

- Lesson 1: Hello and Goodbye (Ahoj, Na shledanou)
- Lesson 2: Please and Thank You (Prosím, Děkuji)
- Lesson 3: Yes and No (Ano, Ne)
- Lesson 4: Excuse Me (Promiňte)

**Total Content:**

- 4 Complete Lessons
- 20+ Flashcards with SRS
- 12+ Interactive Exercises
- Audio Pronunciation
- Cultural Context

## 🚀 Deployment

This app is ready for deployment on Vercel, Netlify, or any Node.js hosting platform:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Areas for contribution:

- Additional Czech lessons and vocabulary
- New exercise types
- Audio recordings by native speakers
- UI/UX improvements
- Performance optimizations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Czech language experts and native speakers
- Modern language learning methodologies
- Open source community
- Educational technology inspiration from Duolingo, Anki, and Memrise

---

**Ready to learn Czech? Start with Unit 1 and master basic greetings! 🎉**

**Šťastné učení! (Happy Learning!)**
