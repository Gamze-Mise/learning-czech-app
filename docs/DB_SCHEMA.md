# Database Schema Documentation

## Overview

The Czech Learning App uses a relational database design optimized for language learning applications. The schema supports structured learning paths, progress tracking, and spaced repetition systems.

## Database Technology

- **Development**: SQLite
- **Production**: MySQL/PostgreSQL
- **ORM**: Prisma
- **Migrations**: Prisma Migrate

## Core Models

### User

Represents user accounts and basic profile information.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  firstName String?
  lastName  String?
  level     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userStats        UserStats[]
  flashcardProgress FlashcardProgress[]
  exerciseResults   ExerciseResult[]
  studySessions     StudySession[]
  userAchievements  UserAchievement[]
}
```

**Fields:**

- `id`: Unique identifier
- `email`: User's email address (unique)
- `username`: Display name (unique)
- `firstName`, `lastName`: Optional name fields
- `level`: Current learning level (1-10)
- `createdAt`, `updatedAt`: Timestamps

### Course

Represents a complete learning course or curriculum.

```prisma
model Course {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  level       Int      @default(1)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  units Unit[]
}
```

**Fields:**

- `id`: Unique identifier
- `title`: Course name
- `description`: Course overview
- `level`: Difficulty level
- `isActive`: Whether course is available

### Unit

Represents a major section within a course.

```prisma
model Unit {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  level       Int      @default(1)
  order       Int      @default(0)
  courseId    Int
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  course   Course   @relation(fields: [courseId], references: [id])
  lessons  Lesson[]
}
```

**Fields:**

- `id`: Unique identifier
- `title`: Unit name
- `description`: Unit overview
- `level`: Difficulty level
- `order`: Display order within course
- `courseId`: Foreign key to Course

### Lesson

Represents an individual learning session.

```prisma
model Lesson {
  id           Int      @id @default(autoincrement())
  title        String
  description  String?
  type         LessonType
  level        Int      @default(1)
  order        Int      @default(0)
  estimatedTime Int?    // in minutes
  unitId       Int
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  unit        Unit         @relation(fields: [unitId], references: [id])
  parts       LessonPart[]
  flashcards  Flashcard[]
  exercises   Exercise[]
  studySessions StudySession[]
}

enum LessonType {
  VOCABULARY
  GRAMMAR
  CONVERSATION
  PRONUNCIATION
  CULTURE
  REVIEW
}
```

**Fields:**

- `id`: Unique identifier
- `title`: Lesson name
- `description`: Lesson overview
- `type`: Learning category
- `level`: Difficulty level
- `order`: Display order within unit
- `estimatedTime`: Expected completion time
- `unitId`: Foreign key to Unit

### LessonPart

Represents components within a lesson (theory, examples, practice).

```prisma
model LessonPart {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   // Markdown content
  type      PartType
  order     Int      @default(0)
  lessonId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  lesson Lesson @relation(fields: [lessonId], references: [id])
}

enum PartType {
  THEORY
  EXAMPLE
  PRACTICE
  SUMMARY
}
```

**Fields:**

- `id`: Unique identifier
- `title`: Part name
- `content`: Markdown-formatted content
- `type`: Content category
- `order`: Display order within lesson
- `lessonId`: Foreign key to Lesson

### Flashcard

Represents vocabulary and concept cards for spaced repetition.

```prisma
model Flashcard {
  id          Int      @id @default(autoincrement())
  frontText   String
  backText    String
  frontAudio  String?  // Audio file URL
  backAudio   String?  // Audio file URL
  image       String?  // Image file URL
  difficulty  Int      @default(1) // 1-5 scale
  order       Int      @default(0)
  lessonId    Int
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  lesson   Lesson            @relation(fields: [lessonId], references: [id])
  progress FlashcardProgress[]
}
```

**Fields:**

- `id`: Unique identifier
- `frontText`: Question/prompt text
- `backText`: Answer/explanation text
- `frontAudio`, `backAudio`: Optional audio files
- `image`: Optional visual aid
- `difficulty`: Complexity rating (1-5)
- `order`: Display order within lesson
- `lessonId`: Foreign key to Lesson

### FlashcardProgress

Tracks user progress on individual flashcards using SRS.

```prisma
model FlashcardProgress {
  id             Int      @id @default(autoincrement())
  userId         Int
  flashcardId    Int
  box            Int      @default(1) // Leitner box (1-5)
  correctCount   Int      @default(0)
  wrongCount     Int      @default(0)
  streak         Int      @default(0)
  nextDue        DateTime?
  lastReviewed   DateTime?
  isMastered     Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id])
  flashcard Flashcard @relation(fields: [flashcardId], references: [id])

  @@unique([userId, flashcardId])
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User
- `flashcardId`: Foreign key to Flashcard
- `box`: Current Leitner box (1-5)
- `correctCount`, `wrongCount`: Performance counters
- `streak`: Consecutive correct answers
- `nextDue`: Next review date
- `lastReviewed`: Last review timestamp
- `isMastered`: Mastery status

### Exercise

Represents practice questions and quizzes.

```prisma
model Exercise {
  id          Int      @id @default(autoincrement())
  question    String
  options     Json?    // Multiple choice options
  correctAnswer String
  explanation String?
  type        ExerciseType
  difficulty  Int      @default(1) // 1-5 scale
  order       Int      @default(0)
  lessonId    Int
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  lesson  Lesson         @relation(fields: [lessonId], references: [id])
  results ExerciseResult[]
}

enum ExerciseType {
  MULTIPLE_CHOICE
  FILL_IN_BLANK
  TRUE_FALSE
  MATCHING
  TRANSLATION
}
```

**Fields:**

- `id`: Unique identifier
- `question`: Question text
- `options`: JSON array of choices (for multiple choice)
- `correctAnswer`: Correct answer
- `explanation`: Answer explanation
- `type`: Question format
- `difficulty`: Complexity rating (1-5)
- `order`: Display order within lesson
- `lessonId`: Foreign key to Lesson

### ExerciseResult

Tracks user performance on exercises.

```prisma
model ExerciseResult {
  id         Int      @id @default(autoincrement())
  userId     Int
  exerciseId Int
  answer     String
  correct    Boolean
  timeSpent  Int      // in seconds
  createdAt  DateTime @default(now())

  // Relations
  user     User     @relation(fields: [userId], references: [id])
  exercise Exercise @relation(fields: [exerciseId], references: [id])
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User
- `exerciseId`: Foreign key to Exercise
- `answer`: User's answer
- `correct`: Whether answer was correct
- `timeSpent`: Time taken to answer

### StudySession

Tracks user learning sessions.

```prisma
model StudySession {
  id          Int      @id @default(autoincrement())
  userId      Int
  lessonId    Int?
  startTime   DateTime @default(now())
  endTime     DateTime?
  duration    Int?     // in seconds
  flashcardsReviewed Int @default(0)
  exercisesCompleted Int @default(0)
  xpEarned    Int      @default(0)
  createdAt   DateTime @default(now())

  // Relations
  user   User    @relation(fields: [userId], references: [id])
  lesson Lesson? @relation(fields: [lessonId], references: [id])
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User
- `lessonId`: Optional lesson context
- `startTime`, `endTime`: Session timestamps
- `duration`: Total session time
- `flashcardsReviewed`: Number of cards reviewed
- `exercisesCompleted`: Number of exercises completed
- `xpEarned`: Experience points gained

### UserStats

Aggregated user statistics for performance tracking.

```prisma
model UserStats {
  id                Int      @id @default(autoincrement())
  userId            Int      @unique
  totalXP           Int      @default(0)
  level             Int      @default(1)
  lessonsCompleted  Int      @default(0)
  flashcardsMastered Int     @default(0)
  exercisesCompleted Int     @default(0)
  averageAccuracy   Float    @default(0.0)
  studyStreak       Int      @default(0)
  lastStudyDate     DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id])
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User (unique)
- `totalXP`: Total experience points
- `level`: Current user level
- `lessonsCompleted`: Total lessons finished
- `flashcardsMastered`: Total mastered flashcards
- `exercisesCompleted`: Total exercises completed
- `averageAccuracy`: Overall accuracy percentage
- `studyStreak`: Consecutive study days
- `lastStudyDate`: Last study session date

### UserAchievement

Represents user achievements and badges.

```prisma
model UserAchievement {
  id           Int      @id @default(autoincrement())
  userId       Int
  achievementId Int
  earnedAt     DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@unique([userId, achievementId])
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User
- `achievementId`: Achievement type identifier
- `earnedAt`: Achievement date

## Indexes and Constraints

### Primary Keys

All models use auto-incrementing integer primary keys.

### Unique Constraints

- `User.email`: Unique email addresses
- `User.username`: Unique usernames
- `FlashcardProgress(userId, flashcardId)`: One progress record per user per flashcard
- `UserStats.userId`: One stats record per user
- `UserAchievement(userId, achievementId)`: One achievement per user per type

### Foreign Key Constraints

All foreign key relationships are properly defined with referential integrity.

### Indexes

- `User.email`: For login lookups
- `FlashcardProgress.nextDue`: For SRS scheduling
- `StudySession.userId`: For user session history
- `ExerciseResult.userId`: For user performance tracking

## Data Relationships

### Hierarchical Structure

```
Course (1) → Unit (many) → Lesson (many) → LessonPart (many)
                                    ↓
                              Flashcard (many)
                              Exercise (many)
```

### User Progress Tracking

```
User (1) → FlashcardProgress (many) → Flashcard (1)
User (1) → ExerciseResult (many) → Exercise (1)
User (1) → StudySession (many) → Lesson (1)
User (1) → UserStats (1)
User (1) → UserAchievement (many)
```

## Performance Considerations

### Query Optimization

- Proper indexing on frequently queried fields
- Efficient joins for related data
- Pagination for large result sets

### Data Integrity

- Foreign key constraints
- Unique constraints where appropriate
- Default values for required fields

### Scalability

- Normalized design to reduce redundancy
- Efficient data types (INT vs BIGINT)
- Proper relationship modeling

## Migration Strategy

### Development

- SQLite for local development
- Prisma migrations for schema changes
- Seed data for testing

### Production

- MySQL/PostgreSQL for production
- Database backups and recovery
- Performance monitoring

---

_Last Updated: January 2025_
_Version: 1.0_
