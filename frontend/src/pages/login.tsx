import React from "react";
import BaseButton from "../components/BaseButton";
import BaseInput from "../components/BaseInput";
import { config } from "../config";

export default function Login() {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const username = data.username;
    const password = data.password;
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(`${backendURL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data) return;
      document.cookie = `auth_session=${data.token}; max-age=604800; path=/; SameSite=Strict`;
      setSuccess("Login erfolgreich. Weiterleitung...");
      setTimeout(() => {
        window.location.href = "/app";
      }, 1500);
    } else if (res.status === 401) {
      setError("Falscher Benutzername oder Passwort.");
    } else {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen px-4 login-bg">
      <div>
        <div className="rounded-lg p-4 flex items-center gap-4 border border-border-100 mb-6 w-fit mx-auto text-primary">
          <span className="text-2xl">{config.name}</span>
        </div>
        <h1 className="text-center font-medium text-2xl mb-6">Login</h1>
        <div>
          <form
            onSubmit={handleLoginSubmit}
            id="login"
            className="flex flex-col gap-4"
          >
            <BaseInput
              type="text"
              name="username"
              placeholder="Benutzername"
              required
            />
            <BaseInput
              type="password"
              name="password"
              placeholder="Passwort"
              required
            />
            <a className="text-gray hover:text-black transition-colors cursor-pointer">
              Passwort vergessen?
            </a>
            <BaseButton buttonType="submit" type="primary">
              Login
            </BaseButton>
          </form>
          {error && <p className="text-red text-center mt-4">{error}</p>}
          {success && <p className="text-green text-center mt-4">{success}</p>}
        </div>
      </div>
    </div>
  );
}
