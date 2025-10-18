# 🇨🇿 Czech Learning App

A comprehensive Czech language learning application built with Next.js 15, TypeScript, and Tailwind CSS. This interactive platform helps users master Czech through structured lessons, flashcards, and engaging exercises with real-time progress tracking and dynamic content delivery.

## ✨ Current Features

### 📚 Complete Learning System

- **3 Full Units**: Basic Greetings, Numbers & Time, Family & Relationships (21 lessons total)
- **Interactive Lessons**: Rich content with audio, images, and vocabulary practice
- **Smart Flashcard System**: Dynamic image rotation with audio pronunciation
- **Exercise Types**: Multiple choice, fill-in-the-blank, and interactive matching exercises
- **Real-time Progress**: Dynamic progress tracking with lesson completion flow
- **Continue Learning**: Smart resume functionality to pick up where you left off

### 🎯 Interactive Learning Tools

- **Smart Flashcards**: 4 rotating sample images with beep audio for pronunciation
- **Flexible Exercise Validation**: Accepts answers ignoring case, accents, and minor spelling differences
- **Audio Integration**: Generated beep sounds for pronunciation practice
- **Seamless Navigation**: Automatic progression to next exercise/lesson upon completion
- **Dashboard Analytics**: Real-time statistics showing vocabulary mastery and grammar progress

### 📱 User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Feedback**: Instant exercise results and explanations
- **Smooth Navigation**: Client-side routing with Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon) with Prisma ORM
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

3. **Set up environment variables:**

```bash
# Copy environment template
cp env.example .env.local

# Add your database URL (PostgreSQL/Neon)
# DATABASE_URL="your-postgresql-connection-string"
```

4. **Set up the database:**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with Czech course data
npx prisma db seed
```

5. **Start the development server:**

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

**Unit 1: Basic Greetings and Introductions**

- 1.1 Hello and Goodbye (Ahoj, Na shledanou)
- 1.2 Introducing Yourself (Jmenuji se...)
- 1.3 How Are You? (Jak se máš?)
- 1.4 Please and Thank You (Prosím, Děkuji)
- 1.5 Excuse Me and Sorry (Promiňte, Omlouvám se)
- 1.6 Meeting People (Těší mě)
- 1.7 Formal vs Informal Speech

**Unit 2: Numbers, Time and Dates**

- 2.1 Numbers 1-10
- 2.2 Numbers 11-20
- 2.3 Numbers 21-100
- 2.4 Telling Time - Hours
- 2.5 Telling Time - Minutes
- 2.6 Days of the Week
- 2.7 Months and Seasons
- 2.8 Dates and Birthdays

**Unit 3: Family, People and Relationships**

- 3.1 Family Members
- 3.2 Extended Family
- 3.3 Physical Appearance
- 3.4 Personality Traits
- 3.5 Relationships and Friends
- 3.6 Family Activities

**Total Content:**

- 21 Complete Lessons across 3 units
- 50+ Flashcards with dynamic images and audio
- 100+ Interactive Exercises (MCQ, Fill-in, Matching)
- Sample audio pronunciation (beep sounds)
- Progress tracking and analytics

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
