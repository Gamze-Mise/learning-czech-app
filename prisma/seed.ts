import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create first unit
  const unit = await prisma.unit.create({
    data: {
      title: "01 - Temel Selamlaşmalar",
      order: 1,
      description: "Günlük selamlaşmalar ve temel ifadeler",
    },
  });

  console.log("✅ Created unit:", unit.title);

  // Create first lesson
  const lesson = await prisma.lesson.create({
    data: {
      unitId: unit.id,
      title: "1.1 Merhaba ve Vedalaşma",
      order: 1,
      description: "Basit selamlaşma ifadeleri",
    },
  });

  console.log("✅ Created lesson:", lesson.title);

  // Create lesson parts
  await prisma.lessonPart.createMany({
    data: [
      {
        lessonId: lesson.id,
        order: 1,
        type: "text",
        content: {
          markdown:
            "### Ahoj - Merhaba\n\nBu derste temel Çekçe selamlaşma ifadelerini öğreneceksiniz.",
        },
      },
      {
        lessonId: lesson.id,
        order: 2,
        type: "audio",
        audioUrl: "/uploads/unit01_l01_intro.mp3",
      },
      {
        lessonId: lesson.id,
        order: 3,
        type: "flashcard_list",
      },
    ],
  });

  console.log("✅ Created lesson parts");

  // Create flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        lessonId: lesson.id,
        order: 1,
        frontText: "Ahoj",
        backText: "Merhaba",
        audioUrl: "/uploads/unit01_l01_card01.mp3",
        example: "Ahoj! Jak se máš? — Merhaba! Nasılsın?",
      },
      {
        lessonId: lesson.id,
        order: 2,
        frontText: "Děkuji",
        backText: "Teşekkür ederim",
        audioUrl: "/uploads/unit01_l01_card02.mp3",
        example: "Děkuji za pomoc — Yardım için teşekkür ederim",
      },
      {
        lessonId: lesson.id,
        order: 3,
        frontText: "Na shledanou",
        backText: "Hoşça kal",
        audioUrl: "/uploads/unit01_l01_card03.mp3",
        example: "Na shledanou! — Hoşça kal!",
      },
      {
        lessonId: lesson.id,
        order: 4,
        frontText: "Dobrý den",
        backText: "İyi günler",
        audioUrl: "/uploads/unit01_l01_card04.mp3",
        example: "Dobrý den! — İyi günler!",
      },
    ],
  });

  console.log("✅ Created flashcards");

  // Create exercises
  await prisma.exercise.createMany({
    data: [
      {
        lessonId: lesson.id,
        order: 1,
        type: "mcq",
        question: "Ahoj kelimesinin anlamı nedir?",
        options: [
          { text: "Merhaba", correct: true },
          { text: "Teşekkür", correct: false },
          { text: "Hoşça kal", correct: false },
          { text: "İyi günler", correct: false },
        ],
      },
      {
        lessonId: lesson.id,
        order: 2,
        type: "fill",
        question: "Teşekkür ederim = _____",
        answer: "Děkuji",
      },
    ],
  });

  console.log("✅ Created exercises");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
