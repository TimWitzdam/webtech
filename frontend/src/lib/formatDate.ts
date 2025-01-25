export function formatDate(date: Date) {
  const now = new Date().getTime();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Gerade eben";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Vor ${diffInMinutes} Minute${diffInMinutes > 1 ? "n" : ""}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Vor ${diffInHours} Stunde${diffInHours > 1 ? "n" : ""}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Vor ${diffInDays} Tag${diffInDays > 1 ? "en" : ""}`;
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return then.toLocaleDateString("de-DE", options);
}
