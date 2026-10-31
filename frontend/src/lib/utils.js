export function getBackendUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000"
  );
}

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${getBackendUrl()}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export function formatDate(date) {
  if (!date) return "Date not provided";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}