# 🇨🇿 Czech Learning App

A full-stack Czech learning application built with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**.  
The app includes interactive lessons, flashcards, exercises, and progress tracking in a simple and user-friendly interface.

**Live Demo:** [learning-czech-app.vercel.app](https://learning-czech-app.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://learning-czech-app.vercel.app/)

## Features

- Interactive Czech lessons organized into learning units
- Flashcard practice for vocabulary review
- Different exercise types such as multiple choice and fill-in-the-blank
- Progress tracking for completed lessons and exercises
- Responsive UI for desktop and mobile use
- Full-stack setup with database integration and deployment on Vercel

## Screenshots

### Homepage
![Homepage](./public/images/screenshots/main-page.png)

### Learning Units
![Units](./public/images/screenshots/units.png)

### Lesson Page
![Lessons](./public/images/screenshots/lesson-page.png)

### Flashcards
![Flashcards](./public/images/screenshots/flashcard-question.png)

### Exercises
![Exercises](./public/images/screenshots/exercise.png)

### Dashboard
![Dashboard](./public/images/screenshots/dashboard.png)

## Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- PostgreSQL (Neon)
- SQLite for local development

### Deployment
- Vercel

## Getting Started

```bash
git clone https://github.com/Gamze-Mise/learning-czech-app.git
cd learning-czech-app
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
