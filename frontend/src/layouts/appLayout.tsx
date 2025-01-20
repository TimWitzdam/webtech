import { Outlet } from "react-router-dom";
import SearchIcon from "../components/icons/SearchIcon";
import BellIcon from "../components/icons/BellIcon";
import UserIcon from "../components/icons/UserIcon";
import { config } from "../config";
import BaseButton from "../components/BaseButton";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar";
import React from "react";
import HeaderLink from "../components/app/HeaderLink";
import XMark from "../components/icons/XMark";
import FilledBellIcon from "../components/icons/FilledBellIcon";
import { formatDate } from "../lib/formatDate";
import SearchMenu from "../components/app/SearchMenu";

export default function AppLayout() {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setShowNotifications(false);
    }
  }

  const notifications = [
    {
      id: 1,
      title: "Neue Aufgabe",
      description: "Löse die Aufgabe 2.1",
      link: "/app/courses/rechnernetze",
      createdAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      read: false,
    },
    {
      id: 2,
      title: "Neue Aufgabe",
      description: "Löse die Aufgabe 2.1",
      link: "/app/courses/rechnernetze",
      createdAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      read: true,
    },
  ];

  interface CoursesSearchResult {
    id: number;
    name: string;
    link: string;
  }

  interface VideosSearchResult {
    id: number;
    name: string;
    course: string;
    link: string;
  }

  const searchResults: {
    courses: CoursesSearchResult[];
    videos: VideosSearchResult[];
  } = {
    courses: [
      {
        id: 1,
        name: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 2,
        name: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 3,
        name: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 4,
        name: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 5,
        name: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
    ],
    videos: [
      {
        id: 1,
        name: "Video 1",
        course: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 2,
        name: "Video 1",
        course: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 3,
        name: "Video 1",
        course: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
      {
        id: 4,
        name: "Video 1",
        course: "Rechnernetze",
        link: "/app/courses/rechnernetze",
      },
    ],
  };

  return (
    <div className="min-h-screen relative">
      <header className="bg-white border-b border-border-100 py-5 max-w-screen-3xl mx-auto 3xl:border-x 3xl:rounded-b-xl 3xl:absolute 3xl:top-0 3xl:left-1/2 3xl:-translate-x-1/2 3xl:z-50 3xl:w-full">
        <div className="flex items-center justify-between px-3">
          <div className="flex gap-8">
            <a
              href="/app"
              className="text-primary font-medium text-lg rounded-full border border-border-100 py-2 px-3 hover:border-border-200 transition-colors"
            >
              {config.name}
            </a>
            <div className="hidden md:block border-r border-border-100"></div>
            <div className="hidden md:flex items-center gap-8">
              <HeaderLink url="/app" name="Startseite" />
              <HeaderLink url="/app/saved" name="Gespeichert" />
              <HeaderLink url="/app/courses" name="Kurse" />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="lg:hidden">
              <BaseButton
                type="rounded"
                onClick={() => setShowSearchResults(true)}
              >
                <SearchIcon />
              </BaseButton>
              {showSearchResults && (
                <SearchMenu
                  searchResults={searchResults}
                  closeSearchMenu={() => setShowSearchResults(false)}
                />
              )}
            </div>
            <div className="hidden lg:flex">
              <div className="lg:flex relative">
                <div className="border border-border-100 rounded-l-full focus-within:border-primary">
                  <input
                    className="outline-none rounded-full py-2 pl-4"
                    type="text"
                    placeholder="Suche..."
                  />
                </div>
                <div
                  className="grid place-content-center bg-bg-200 border-r border-y border-border-100 px-4 rounded-r-full cursor-pointer"
                  onClick={() => setShowSearchResults(!showSearchResults)}
                >
                  <SearchIcon />
                </div>
                {showSearchResults && (
                  <SearchMenu
                    searchResults={searchResults}
                    closeSearchMenu={() => setShowSearchResults(false)}
                  />
                )}
              </div>
              <div className="border-l border-border-100 ml-4"></div>
            </div>
            <BaseButton
              type="rounded"
              onClick={() => setShowNotifications(true)}
            >
              <BellIcon />
            </BaseButton>

            <BaseButton type="rounded" className="text-primary">
              <UserIcon />
            </BaseButton>
          </div>
        </div>
      </header>
      {showNotifications && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white md:w-1/2 lg:w-1/3 xl:w-1/4 py-3 ml-auto h-full">
            <div className="px-3 pb-3 flex items-center justify-between border-b border-border-100">
              <h1 className="font-medium text-xl">Benachrichtigungen</h1>
              <BaseButton
                type="rounded"
                onClick={() => setShowNotifications(false)}
                className="h-9 w-9 grid place-content-center text-primary"
              >
                <XMark />
              </BaseButton>
            </div>
            <div className="px-3 mt-4 grid gap-5">
              {notifications.map((notification) => (
                <a
                  href={notification.link}
                  className={`flex gap-2 group ${notification.read ? "opacity-60" : ""}`}
                >
                  <div className="rounded-full border border-border-100 w-10 h-10 grid place-content-center text-primary">
                    {notification.read ? <BellIcon /> : <FilledBellIcon />}
                  </div>
                  <div>
                    <p className="font-medium md:text-lg group-hover:underline">
                      {notification.title}
                    </p>
                    <p className="text-sm mb-2">{notification.description}</p>
                    <p className="text-xs text-gray">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <main className="3xl:pt-[88px]">
        <div className="pb-[85px]">
          <Outlet />
        </div>
        <div className="md:hidden">
          <BottomNavbar />
        </div>
      </main>
    </div>
  );
}
