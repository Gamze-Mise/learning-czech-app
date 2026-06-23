export function getLessonTypeColor(type: string): string {
  switch (type) {
    case "VOCABULARY":
      return "bg-blue-500";
    case "GRAMMAR":
      return "bg-green-500";
    case "CONVERSATION":
      return "bg-purple-500";
    case "CULTURE":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
}

export function getProgressColor(
  progress: number
): "green" | "blue" | "orange" | "gray" {
  if (progress === 100) return "green";
  if (progress >= 50) return "blue";
  if (progress > 0) return "orange";
  return "gray";
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return time.toLocaleDateString();
}

export function getActivityIcon(type: string): string {
  switch (type) {
    case "lesson":
      return "📚";
    case "flashcard":
      return "🎴";
    case "exercise":
      return "🧪";
    default:
      return "📖";
  }
}

export function getActivityColor(type: string): string {
  switch (type) {
    case "lesson":
      return "bg-green-500";
    case "flashcard":
      return "bg-blue-500";
    case "exercise":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}
