export default function Home() {
  function getCookie(cookies: string, name: string) {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const cookies = document.cookie;

  if (getCookie(cookies, "auth_session")) {
    location.href = "/app";
  } else {
    location.href = "/login";
  }

  return (
    <div>
      If you're not being redirected, please make sure your browser supports
      Javascript.
    </div>
  );
}
