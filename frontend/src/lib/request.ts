const backendURL = import.meta.env.VITE_BACKEND_URL;

export default async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(`${backendURL}/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //TODO: remove production
    ...options,
  });
  if (!res.ok) {
    if (res.status === 500) {
      return { error: "Unbekannter Fehler" };
    } else {
      return await res.json();
    }
  } else {
    try {
      return await res.json();
    } catch (err) {
      return { error: "Unbekannter Fehler" };
    }
  }
}
