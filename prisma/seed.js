const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Czech Learning App seed...");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.exerciseResult.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.flashcardProgress.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.lessonPart.deleteMany();
    await prisma.studySession.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.courses.deleteMany();
    await prisma.userStats.deleteMany();
    await prisma.userPreferences.deleteMany();
    await prisma.user.deleteMany();

    // ===== 1. CREATE ADMIN USER =====
    console.log("👤 Creating admin user...");
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@czechlearning.com",
            name: "Admin User",
            role: "ADMIN",
            level: 10,
            streak: 0,
            totalXP: 0,
        },
    });

    // Create user preferences for admin
    await prisma.userPreferences.create({
        data: {
            userId: adminUser.id,
            language: "en",
            theme: "light",
            soundEnabled: true,
            notifications: true,
            dailyGoal: 20,
            srsEnabled: true,
        },
    });

    // Create user stats for admin
    await prisma.userStats.create({
        data: {
            userId: adminUser.id,
            totalStudyTime: 0,
            totalFlashcards: 0,
            totalExercises: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            longestStreak: 0,
            currentStreak: 0,
            weeklyGoal: 100,
            weeklyProgress: 0,
            level: 1,
            xp: 0,
        },
    });

    console.log("✅ Created admin user:", adminUser.email);

    // ===== 2. CREATE ACHIEVEMENTS =====
    console.log("🏆 Creating achievements...");
    const achievements = await prisma.achievement.createMany({
        data: [
            {
                name: "First Steps",
                description: "Complete your first lesson",
                icon: "🎯",
                category: "milestone",
                requirement: { type: "lessons_completed", value: 1 },
                xpReward: 50,
            },
            {
                name: "Streak Master",
                description: "Study for 7 days in a row",
                icon: "🔥",
                category: "streak",
                requirement: { type: "streak", value: 7 },
                xpReward: 100,
            },
            {
                name: "Vocabulary Builder",
                description: "Learn 50 new words",
                icon: "📚",
                category: "vocabulary",
                requirement: { type: "flashcards_mastered", value: 50 },
                xpReward: 200,
            },
            {
                name: "Grammar Expert",
                description: "Complete 10 grammar lessons",
                icon: "📝",
                category: "grammar",
                requirement: { type: "grammar_lessons", value: 10 },
                xpReward: 150,
            },
        ],
    });

    console.log("✅ Created achievements");

    // ===== 3. CREATE CZECH COURSE =====
    console.log("📚 Creating Czech course...");
    const czechCourse = await prisma.courses.create({
        data: {
            title: "Learn Czech Language",
            description: "Comprehensive course to learn Czech language from scratch",
            level: 1,
            order: 1,
            thumbnail: "/images/czech-course.jpg",
        },
    });

    console.log("✅ Created Czech course:", czechCourse.title);

    // ===== 4. CREATE CZECH UNITS =====
    console.log("📖 Creating Czech units...");

    const unit1 = await prisma.unit.create({
        data: {
            courseId: czechCourse.id,
            title: "01 - Basic Greetings",
            order: 1,
            description: "Daily greetings and basic expressions",
            level: 1,
            thumbnail: "/images/unit-greetings.jpg",
        },
    });

    const unit2 = await prisma.unit.create({
        data: {
            courseId: czechCourse.id,
            title: "02 - Numbers and Time",
            order: 2,
            description: "Numbers, hours and dates",
            level: 1,
            thumbnail: "/images/unit-numbers.jpg",
        },
    });

    const unit3 = await prisma.unit.create({
        data: {
            courseId: czechCourse.id,
            title: "03 - Family and People",
            order: 3,
            description: "Family members and person descriptions",
            level: 1,
            thumbnail: "/images/unit-family.jpg",
        },
    });

    const unit4 = await prisma.unit.create({
        data: {
            courseId: czechCourse.id,
            title: "04 - Daily Life",
            order: 4,
            description: "Daily activities and routines",
            level: 2,
            thumbnail: "/images/unit-daily.jpg",
        },
    });

    const unit5 = await prisma.unit.create({
        data: {
            courseId: czechCourse.id,
            title: "05 - Food and Drinks",
            order: 5,
            description: "Food, drinks and restaurant",
            level: 2,
            thumbnail: "/images/unit-food.jpg",
        },
    });

    console.log("✅ Created Czech units");

    // ===== 5. CREATE LESSONS =====
    console.log("📝 Creating lessons...");

    // Unit 1 Lessons
    const lesson1_1 = await prisma.lesson.create({
        data: {
            unitId: unit1.id,
            title: "1.1 Hello and Goodbye",
            order: 1,
            description: "Basic greeting expressions",
            type: "VOCABULARY",
            difficulty: 1,
            estimatedTime: 15,
            thumbnail: "/images/lesson-greetings.jpg",
        },
    });

    const lesson1_2 = await prisma.lesson.create({
        data: {
            unitId: unit1.id,
            title: "1.2 Introducing Yourself",
            order: 2,
            description: "Saying name, age and hometown",
            type: "CONVERSATION",
            difficulty: 2,
            estimatedTime: 20,
            thumbnail: "/images/lesson-introduction.jpg",
        },
    });

    const lesson1_3 = await prisma.lesson.create({
        data: {
            unitId: unit1.id,
            title: "1.3 How Are You?",
            order: 3,
            description: "Asking and answering about condition",
            type: "CONVERSATION",
            difficulty: 2,
            estimatedTime: 18,
            thumbnail: "/images/lesson-how-are-you.jpg",
        },
    });

    // Unit 2 Lessons
    const lesson2_1 = await prisma.lesson.create({
        data: {
            unitId: unit2.id,
            title: "2.1 Numbers 1-20",
            order: 1,
            description: "Basic numbers",
            type: "VOCABULARY",
            difficulty: 1,
            estimatedTime: 25,
            thumbnail: "/images/lesson-numbers.jpg",
        },
    });

    const lesson2_2 = await prisma.lesson.create({
        data: {
            unitId: unit2.id,
            title: "2.2 Telling Time",
            order: 2,
            description: "Asking and telling time",
            type: "VOCABULARY",
            difficulty: 2,
            estimatedTime: 30,
            thumbnail: "/images/lesson-time.jpg",
        },
    });

    // Unit 3 Lessons
    const lesson3_1 = await prisma.lesson.create({
        data: {
            unitId: unit3.id,
            title: "3.1 Family Members",
            order: 1,
            description: "Learning family members",
            type: "VOCABULARY",
            difficulty: 1,
            estimatedTime: 20,
            thumbnail: "/images/lesson-family.jpg",
        },
    });

    const lesson3_2 = await prisma.lesson.create({
        data: {
            unitId: unit3.id,
            title: "3.2 Describing People",
            order: 2,
            description: "Physical features and character",
            type: "VOCABULARY",
            difficulty: 2,
            estimatedTime: 25,
            thumbnail: "/images/lesson-descriptions.jpg",
        },
    });

    // Unit 4 Lessons
    const lesson4_1 = await prisma.lesson.create({
        data: {
            unitId: unit4.id,
            title: "4.1 Daily Routines",
            order: 1,
            description: "Morning routines and daily activities",
            type: "VOCABULARY",
            difficulty: 2,
            estimatedTime: 30,
            thumbnail: "/images/lesson-routine.jpg",
        },
    });

    const lesson4_2 = await prisma.lesson.create({
        data: {
            unitId: unit4.id,
            title: "4.2 Weekend Activities",
            order: 2,
            description: "Weekend activities",
            type: "CONVERSATION",
            difficulty: 3,
            estimatedTime: 25,
            thumbnail: "/images/lesson-weekend.jpg",
        },
    });

    // Unit 5 Lessons
    const lesson5_1 = await prisma.lesson.create({
        data: {
            unitId: unit5.id,
            title: "5.1 Types of Food",
            order: 1,
            description: "Czech cuisine and food types",
            type: "VOCABULARY",
            difficulty: 2,
            estimatedTime: 35,
            thumbnail: "/images/lesson-food.jpg",
        },
    });

    const lesson5_2 = await prisma.lesson.create({
        data: {
            unitId: unit5.id,
            title: "5.2 At the Restaurant",
            order: 2,
            description: "Restaurant ordering and conversation",
            type: "CONVERSATION",
            difficulty: 3,
            estimatedTime: 40,
            thumbnail: "/images/lesson-restaurant.jpg",
        },
    });

    console.log("✅ Created lessons");

    // ===== 6. CREATE LESSON PARTS =====
    console.log("📄 Creating lesson parts...");

    // Lesson 1.1 parts
    await prisma.lessonPart.createMany({
        data: [
            {
                lessonId: lesson1_1.id,
                order: 1,
                type: "TEXT",
                title: "Introduction",
                content: {
                    markdown: "### Ahoj - Hello\n\nIn this lesson you will learn basic Czech greeting expressions.\n\nGreetings are very important in Czech and are frequently used in daily life.",
                },
            },
            {
                lessonId: lesson1_1.id,
                order: 2,
                type: "AUDIO",
                title: "Pronunciation Listening",
                audioUrl: "/uploads/unit01_l01_intro.mp3",
                duration: 45,
            },
            {
                lessonId: lesson1_1.id,
                order: 3,
                type: "FLASHCARD_LIST",
                title: "Vocabulary Cards",
            },
            {
                lessonId: lesson1_1.id,
                order: 4,
                type: "EXERCISE",
                title: "Exercises",
            },
        ],
    });

    // Lesson 2.1 parts (Numbers)
    await prisma.lessonPart.createMany({
        data: [
            {
                lessonId: lesson2_1.id,
                order: 1,
                type: "TEXT",
                title: "Numbers",
                content: {
                    markdown: "### Numbers 1-20\n\nLearning numbers in Czech is very important. They are frequently used in daily life.",
                },
            },
            {
                lessonId: lesson2_1.id,
                order: 2,
                type: "AUDIO",
                title: "Number Pronunciation",
                audioUrl: "/uploads/unit02_l01_numbers.mp3",
                duration: 60,
            },
            {
                lessonId: lesson2_1.id,
                order: 3,
                type: "FLASHCARD_LIST",
                title: "Number Cards",
            },
        ],
    });

    console.log("✅ Created lesson parts");

    // ===== 7. CREATE FLASHCARDS =====
    console.log("🎴 Creating flashcards...");

    // Lesson 1.1 flashcards (Greetings)
    await prisma.flashcard.createMany({
        data: [
            {
                lessonId: lesson1_1.id,
                order: 1,
                frontText: "Ahoj",
                backText: "Hello",
                audioUrl: "/uploads/unit01_l01_card01.mp3",
                example: "Ahoj! Jak se máš? — Hello! How are you?",
                difficulty: 1,
                category: "greeting",
                tags: ["basic", "greeting"],
            },
            {
                lessonId: lesson1_1.id,
                order: 2,
                frontText: "Dobrý den",
                backText: "Good day",
                audioUrl: "/uploads/unit01_l01_card02.mp3",
                example: "Dobrý den! — Good day!",
                difficulty: 1,
                category: "greeting",
                tags: ["daily", "formal"],
            },
            {
                lessonId: lesson1_1.id,
                order: 3,
                frontText: "Děkuji",
                backText: "Thank you",
                audioUrl: "/uploads/unit01_l01_card03.mp3",
                example: "Děkuji za pomoc — Thank you for help",
                difficulty: 1,
                category: "politeness",
                tags: ["thanks", "politeness"],
            },
            {
                lessonId: lesson1_1.id,
                order: 4,
                frontText: "Na shledanou",
                backText: "Goodbye",
                audioUrl: "/uploads/unit01_l01_card04.mp3",
                example: "Na shledanou! — Goodbye!",
                difficulty: 2,
                category: "greeting",
                tags: ["farewell", "formal"],
            },
            {
                lessonId: lesson1_1.id,
                order: 5,
                frontText: "Prosím",
                backText: "Please / You're welcome",
                audioUrl: "/uploads/unit01_l01_card05.mp3",
                example: "Prosím — Please / You're welcome",
                difficulty: 1,
                category: "politeness",
                tags: ["please", "welcome"],
            },
        ],
    });

    // Lesson 2.1 flashcards (Numbers)
    await prisma.flashcard.createMany({
        data: [
            {
                lessonId: lesson2_1.id,
                order: 1,
                frontText: "jeden",
                backText: "one",
                audioUrl: "/uploads/unit02_l01_one.mp3",
                example: "jeden dům — one house",
                difficulty: 1,
                category: "number",
                tags: ["number", "basic"],
            },
            {
                lessonId: lesson2_1.id,
                order: 2,
                frontText: "dva",
                backText: "two",
                audioUrl: "/uploads/unit02_l01_two.mp3",
                example: "dva psi — two dogs",
                difficulty: 1,
                category: "number",
                tags: ["number", "basic"],
            },
            {
                lessonId: lesson2_1.id,
                order: 3,
                frontText: "tři",
                backText: "three",
                audioUrl: "/uploads/unit02_l01_three.mp3",
                example: "tři kočky — three cats",
                difficulty: 1,
                category: "number",
                tags: ["number", "basic"],
            },
            {
                lessonId: lesson2_1.id,
                order: 4,
                frontText: "čtyři",
                backText: "four",
                audioUrl: "/uploads/unit02_l01_four.mp3",
                example: "čtyři auta — four cars",
                difficulty: 1,
                category: "number",
                tags: ["number", "basic"],
            },
            {
                lessonId: lesson2_1.id,
                order: 5,
                frontText: "pět",
                backText: "five",
                audioUrl: "/uploads/unit02_l01_five.mp3",
                example: "pět prstů — five fingers",
                difficulty: 1,
                category: "number",
                tags: ["number", "basic"],
            },
        ],
    });

    // Lesson 3.1 flashcards (Family)
    await prisma.flashcard.createMany({
        data: [
            {
                lessonId: lesson3_1.id,
                order: 1,
                frontText: "rodina",
                backText: "family",
                audioUrl: "/uploads/unit03_l01_family.mp3",
                example: "moje rodina — my family",
                difficulty: 1,
                category: "family",
                tags: ["family", "basic"],
            },
            {
                lessonId: lesson3_1.id,
                order: 2,
                frontText: "matka",
                backText: "mother",
                audioUrl: "/uploads/unit03_l01_mother.mp3",
                example: "moje matka — my mother",
                difficulty: 1,
                category: "family",
                tags: ["family", "mother"],
            },
            {
                lessonId: lesson3_1.id,
                order: 3,
                frontText: "otec",
                backText: "father",
                audioUrl: "/uploads/unit03_l01_father.mp3",
                example: "můj otec — my father",
                difficulty: 1,
                category: "family",
                tags: ["family", "father"],
            },
            {
                lessonId: lesson3_1.id,
                order: 4,
                frontText: "sestra",
                backText: "sister",
                audioUrl: "/uploads/unit03_l01_sister.mp3",
                example: "moje sestra — my sister",
                difficulty: 1,
                category: "family",
                tags: ["family", "sister"],
            },
            {
                lessonId: lesson3_1.id,
                order: 5,
                frontText: "bratr",
                backText: "brother",
                audioUrl: "/uploads/unit03_l01_brother.mp3",
                example: "můj bratr — my brother",
                difficulty: 1,
                category: "family",
                tags: ["family", "brother"],
            },
        ],
    });

    console.log("✅ Created flashcards");

    // ===== 8. CREATE EXERCISES =====
    console.log("🧪 Creating exercises...");

    // Lesson 1.1 exercises
    await prisma.exercise.createMany({
        data: [
            {
                lessonId: lesson1_1.id,
                order: 1,
                type: "MCQ",
                question: "What does 'Ahoj' mean?",
                options: [
                    {
                        text: "Hello",
                        correct: true,
                        explanation: "Ahoj is the most common greeting word in Czech.",
                    },
                    { text: "Thank you", correct: false },
                    { text: "Goodbye", correct: false },
                    { text: "Good day", correct: false },
                ],
                explanation: "Ahoj is the most commonly used greeting word in Czech daily life.",
                difficulty: 1,
                points: 10,
            },
            {
                lessonId: lesson1_1.id,
                order: 2,
                type: "FILL",
                question: "Thank you = _____",
                answer: "Děkuji",
                explanation: "Děkuji is the word used to say thank you in Czech.",
                difficulty: 1,
                points: 10,
            },
            {
                lessonId: lesson1_1.id,
                order: 3,
                type: "MATCHING",
                question: "Match the following words:",
                options: [
                    { left: "Ahoj", right: "Hello" },
                    { left: "Děkuji", right: "Thank you" },
                    { left: "Na shledanou", right: "Goodbye" },
                ],
                difficulty: 2,
                points: 15,
            },
        ],
    });

    // Lesson 2.1 exercises (Numbers)
    await prisma.exercise.createMany({
        data: [
            {
                lessonId: lesson2_1.id,
                order: 1,
                type: "MCQ",
                question: "What is the Czech word for 'one'?",
                options: [
                    { text: "jeden", correct: true },
                    { text: "dva", correct: false },
                    { text: "tři", correct: false },
                    { text: "čtyři", correct: false },
                ],
                explanation: "Jeden is the Czech word for the number one.",
                difficulty: 1,
                points: 10,
            },
            {
                lessonId: lesson2_1.id,
                order: 2,
                type: "FILL",
                question: "Two = _____",
                answer: "dva",
                explanation: "Dva is the Czech word for the number two.",
                difficulty: 1,
                points: 10,
            },
        ],
    });

    console.log("✅ Created exercises");

    console.log("🎉 Czech Learning App seed completed successfully!");
    console.log(`📊 Created:`);
    console.log(`   - 1 Course (Czech)`);
    console.log(`   - 5 Units`);
    console.log(`   - 12 Lessons`);
    console.log(`   - 15 Flashcards`);
    console.log(`   - 5 Exercises`);
    console.log(`   - 1 Admin User`);
    console.log(`   - 4 Achievements`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });