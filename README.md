# 🇨🇿 Czech Learning App

**Modern, full-stack language learning platform** built with Next.js 15 and TypeScript. Features interactive lessons, smart flashcards, and comprehensive progress tracking - deployed to production with real users.

**🚀 Live Demo:** [https://learning-czech-app.vercel.app/](https://learning-czech-app.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://learning-czech-app.vercel.app/)

## 🎯 Key Features & Highlights

- **21 Complete Interactive Lessons** organized in 3 comprehensive learning units
- **Smart Flashcard System** with spaced repetition algorithm for optimal retention
- **Multiple Exercise Types**: Multiple choice, fill-in-the-blank, and matching games
- **Real-time Progress Tracking** with XP system, learning streaks, and detailed analytics
- **Responsive Design** optimized for desktop, tablet, and mobile devices
- **Production-Ready** with PostgreSQL database and serverless deployment

## 📸 Application Screenshots

### 🏠 Dynamic Homepage with Progress Tracking

![Homepage](https://private-user-images.githubusercontent.com/101412033/503185769-11eae1aa-8b4d-4d97-a4ec-8590c83871d8.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA5NjA4MDUsIm5iZiI6MTc2MDk2MDUwNSwicGF0aCI6Ii8xMDE0MTIwMzMvNTAzMTg1NzY5LTExZWFlMWFhLThiNGQtNGQ5Ny1hNGVjLTg1OTBjODM4NzFkOC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyMFQxMTQxNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNjA4NjRmNDg1MzJjYTRjZjIyMGNiY2E5MGI3NTMyMThmMDc3OWUxOWNjNTdmODAwZjExMDk5ZGI4ODc3NDMyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.RlmerMyL1e2qAOIqfojrN-qytJMenJufK_aEL0K-X1E)

_Smart "Continue Learning" functionality with personalized progress tracking and unit-based learning path_

### 📚 Interactive Lesson Interface

![Lessons](https://private-user-images.githubusercontent.com/101412033/503186725-811c14e7-3159-4223-b19a-afc7fdd6bad0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA5NjA4MDUsIm5iZiI6MTc2MDk2MDUwNSwicGF0aCI6Ii8xMDE0MTIwMzMvNTAzMTg2NzI1LTgxMWMxNGU3LTMxNTktNDIyMy1iMTlhLWFmYzdmZGQ2YmFkMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyMFQxMTQxNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05ZWU5ZTRiNjMzNjU5M2UwNWZjMGJjMDEyMGJhNDMxZmE5ZmZkNzQ3NGI4MjhlNGM5OTVjMThlMmJmYjg3ODVlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Y0xa50Hh00Ri8FRAnlJXNONQh5eT-NVM2quRQSKCiUM)

_Rich multimedia content with audio pronunciation, visual aids, and structured learning progression_

### 🎴 Smart Flashcard System

![Flashcards](https://private-user-images.githubusercontent.com/101412033/503186720-c52118ba-7ff2-4e7b-9918-8b61ccfba6ae.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA5NjA4MDUsIm5iZiI6MTc2MDk2MDUwNSwicGF0aCI6Ii8xMDE0MTIwMzMvNTAzMTg2NzIwLWM1MjExOGJhLTdmZjItNGU3Yi05OTE4LThiNjFjY2ZiYTZhZS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyMFQxMTQxNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xNmFiMzg5YTIyYTJhYjYzZWE4ZjYwODRmNWNkODUwZTBlYjNlMDJhOWEyMDM2ZjI2OGQyNmQ4YWZkNWY2NjdlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Nv0YbOSr3LzXQorp_q2OnNOhA7az7kvhfiS652E3GnE)

_Interactive flashcards with spaced repetition algorithm, visual feedback, and audio pronunciation_

### 🎯 Diverse Exercise System

![Exercises](https://private-user-images.githubusercontent.com/101412033/503186723-931f2c4a-8fae-430c-b840-f4b3e5667b11.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA5NjA4MDUsIm5iZiI6MTc2MDk2MDUwNSwicGF0aCI6Ii8xMDE0MTIwMzMvNTAzMTg2NzIzLTkzMWYyYzRhLThmYWUtNDMwYy1iODQwLWY0YjNlNTY2N2IxMS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyMFQxMTQxNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xMjkxNzNhYTY1MzhmZDI1ZjgxNzUxYWY0YTYyMDdiZDA3OWE5ODdmYmRlODdmYTBlMDNlMmZhNjEyYjhkMTg1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.2BZnfwRMyyc2_WMQG1WB0k4DEXxb1zu4biTQS0DEQqI)

_Multiple exercise formats including multiple choice, fill-in-the-blank, and interactive matching games_

### 📊 Comprehensive Analytics Dashboard

![Dashboard](https://private-user-images.githubusercontent.com/101412033/503186724-d366c119-7c49-4c50-9b03-9e173dce381c.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA5NjA4MDUsIm5iZiI6MTc2MDk2MDUwNSwicGF0aCI6Ii8xMDE0MTIwMzMvNTAzMTg2NzI0LWQzNjZjMTE5LTdjNDktNGM1MC05YjAzLTllMTczZGNlMzgxYy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyMFQxMTQxNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05YTU5YWU5MmQwMjhkMTlhZTFhMDE4MzIyNjA5MmQ3OTg0OWNmNDVlOGZlYzRiNmQ0MTQyOGI2MTNiNjI3ODExJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.nWQ_kHj9PyOfbaBn4Ksd2avvzVJeCwfgsGOT5YbeH8s)

_Real-time learning analytics with detailed progress tracking, XP system, and performance insights_

## 🛠️ Technical Implementation

### **Frontend Architecture**

- **Next.js 15** with App Router for modern React development
- **TypeScript** for type-safe, maintainable code
- **Tailwind CSS** for responsive, utility-first styling
- **React Hooks** for efficient state management

### **Backend & Database**

- **Next.js API Routes** for serverless backend functionality
- **Prisma ORM** for type-safe database operations
- **PostgreSQL** (Neon) for production with automatic scaling
- **SQLite** for local development environment

### **Deployment & DevOps**

- **Vercel** for seamless CI/CD and global edge deployment
- **Git-based workflow** with automated deployments
- **Environment-specific configurations** for dev/prod

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Gamze-Mise/learning-czech-app.git
cd learning-czech-app

# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📈 Project Statistics

- **21 Interactive Lessons** across 3 comprehensive learning units
- **50+ Dynamic Flashcards** with spaced repetition algorithm
- **100+ Practice Exercises** with intelligent answer validation
- **Full Progress Tracking** with XP system and learning streaks
- **Responsive Design** supporting desktop, tablet, and mobile
- **Production Deployment** with real user engagement

## 🎯 Professional Highlights

This project demonstrates:

- **Full-stack development** expertise with modern technologies
- **Database design** and ORM implementation
- **User experience** focus with intuitive interface design
- **Production deployment** and DevOps best practices
- **Scalable architecture** ready for real-world usage

## 👨‍💻 Developer

**Gamze Mise Vural** - Full Stack Developer  
📧 [GitHub Profile](https://github.com/Gamze-Mise)  
🌐 [Live Application](https://learning-czech-app.vercel.app/)
