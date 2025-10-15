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

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm, yarn, pnpm, or bun** (npm comes with Node.js)

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
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your configuration
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your_secret_here"
```

4. **Set up the database:**

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. **Start the development server:**

```bash
npm run dev
```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)

# Data Import
npm run import:flashcards  # Import flashcards from JSON
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"

# Optional: External Services
# GOOGLE_CLIENT_ID="your_google_client_id"
# GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 📁 Project Structure

```
learning-czech-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── units/              # Unit pages
│   │       └── [id]/
│   │           ├── page.tsx    # Unit detail page
│   │           └── lessons/
│   │               └── [lessonId]/
│   │                   └── page.tsx  # Lesson page
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Site header
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Button.tsx          # Button component
│   │   ├── Card.tsx            # Card component
│   │   ├── ProgressBar.tsx     # Progress bar component
│   │   └── PageHeader.tsx      # Page header component
│   └── lib/                    # Utility functions
│       ├── prisma.ts           # Prisma client
│       └── srs.ts              # Spaced repetition system
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed data
├── data/
│   └── sample-flashcards.json  # Sample flashcard data
├── scripts/
│   └── import-flashcards.ts    # Flashcard import script
├── env.example                 # Environment variables example
├── package.json                # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
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
