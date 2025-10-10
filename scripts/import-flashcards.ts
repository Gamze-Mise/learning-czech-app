import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

interface FlashcardImportData {
  lessonId: string;
  order: number;
  frontText: string;
  backText: string;
  audioFileName?: string;
  example?: string;
}

async function main() {
  const jsonFile = process.argv[2];

  if (!jsonFile) {
    console.error("❌ Usage: ts-node scripts/import-flashcards.ts <json-file>");
    process.exit(1);
  }

  try {
    const data: FlashcardImportData[] = JSON.parse(
      fs.readFileSync(jsonFile, "utf-8")
    );

    console.log(`🌱 Importing ${data.length} flashcards...`);

    for (const item of data) {
      const audioUrl = item.audioFileName
        ? `/uploads/${item.audioFileName}`
        : null;

      await prisma.flashcard.create({
        data: {
          lessonId: item.lessonId,
          order: item.order || 1,
          frontText: item.frontText,
          backText: item.backText,
          audioUrl,
          example: item.example || null,
        },
      });

      console.log(`✅ Inserted: ${item.frontText} → ${item.backText}`);
    }

    console.log("🎉 Import completed successfully!");
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
