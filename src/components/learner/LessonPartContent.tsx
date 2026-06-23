import Button from "@/components/Button";
import type { LessonDetail, LessonPart } from "@/lib/learner/types";

type Props = {
  part: LessonPart;
  index: number;
  unitId: string;
  lessonId: string;
  lesson: LessonDetail;
};

export default function LessonPartContent({
  part,
  index,
  unitId,
  lessonId,
  lesson,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{part.title}</h4>
            <span className="text-sm text-gray-700 capitalize font-medium">
              {part.type.toLowerCase()}
            </span>
          </div>
        </div>
        {part.duration ? (
          <span className="text-sm text-gray-500">{part.duration}s</span>
        ) : null}
      </div>

      {part.type === "TEXT" && part.content ? (
        <div className="prose prose-sm max-w-none text-gray-900">
          <div
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                part.content?.markdown?.replace(/\n/g, "<br>") || "",
            }}
          />
        </div>
      ) : null}

      {part.type === "AUDIO" && part.audioUrl ? (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">Audio</p>
          <audio
            controls
            src={part.audioUrl}
            className="w-full max-w-md"
            preload="metadata"
          />
        </div>
      ) : null}

      {part.type === "VIDEO" && part.videoUrl ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Video Content</p>
              <p className="text-xs text-gray-700">Click to watch</p>
            </div>
            <a
              href={part.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
            >
              Watch
            </a>
          </div>
        </div>
      ) : null}

      {part.type === "FLASHCARD_LIST" ? (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Flashcard Practice
              </p>
              <p className="text-xs text-gray-500">
                {lesson.flashcards.length} cards available
              </p>
            </div>
            <Button
              href={`/units/${unitId}/lessons/${lessonId}/flashcards`}
              variant="primary"
              size="sm"
            >
              Practice
            </Button>
          </div>
        </div>
      ) : null}

      {part.type === "EXERCISE" ? (
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Exercises</p>
              <p className="text-xs text-gray-500">
                {lesson.exercises.length} exercises available
              </p>
            </div>
            <Button
              href={`/units/${unitId}/lessons/${lessonId}/exercises`}
              variant="primary"
              size="sm"
            >
              Start
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
