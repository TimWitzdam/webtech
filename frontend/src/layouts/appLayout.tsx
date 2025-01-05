import { Outlet } from "react-router-dom";
import SearchIcon from "../components/icons/SearchIcon";
import BellIcon from "../components/icons/BellIcon";
import UserIcon from "../components/icons/UserIcon";
import { config } from "../config";
import BaseButton from "../components/BaseButton";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar";
import React from "react";
import SmallArrow from "../components/icons/SmallArrow";

export default function AppLayout() {
  const [showCoursesMenu, setCoursesHover] = React.useState(false);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setCoursesHover(false);
    }
  }

  return (
    <div className="min-h-screen relative">
      <header className="border-b border-border-100 py-5">
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
              <a href="/app" className="font-medium text-lg">
                Startseite
              </a>
              <a
                href="/app"
                className="font-medium text-lg opacity-60 hover:opacity-100 transition-opacity"
              >
                Gespeichert
              </a>
              <div
                className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setCoursesHover(!showCoursesMenu)}
              >
                <span className="font-medium text-lg">Kurse</span>
                <SmallArrow />
              </div>
              {showCoursesMenu && (
                <div
                  className="fixed inset-0 top-[88px] bg-black bg-opacity-70"
                  onClick={handleOverlayClick}
                >
                  <div className="bg-white w-full p-3">COurses menu</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="lg:hidden">
              <BaseButton type="rounded">
                <SearchIcon />
              </BaseButton>
            </div>
            <div className="hidden lg:flex">
              <div className="border border-border-100 rounded-l-full focus-within:border-primary">
                <input
                  className="outline-none rounded-full py-2 pl-4"
                  type="text"
                />
              </div>
              <div className="grid place-content-center bg-bg-100 border-r border-y border-border-100 px-4 rounded-r-full cursor-pointer">
                <SearchIcon />
              </div>
              <div className="border-l border-border-100 ml-4"></div>
            </div>
            <BaseButton type="rounded">
              <BellIcon />
            </BaseButton>
            <BaseButton type="rounded">
              <UserIcon />
            </BaseButton>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
        <div className="md:hidden">
          <BottomNavbar />
        </div>
      </main>
    </div>
  );
}
