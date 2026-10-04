import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
BookOpen,
Menu,
Moon,
Sun,
X,
} from "lucide-react";
import { patterns } from "../data/patterns";
import ChatPanel from "./ChatPanel";

const Layout = () => {
const [darkMode, setDarkMode] = useState(() => {
return localStorage.getItem("theme") === "dark";
});

const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const location = useLocation();

useEffect(() => {
const root = document.documentElement;

if (darkMode) {
  root.classList.add("dark");
  localStorage.setItem("theme", "dark");
} else {
  root.classList.remove("dark");
  localStorage.setItem("theme", "light");
}

}, [darkMode]);

useEffect(() => {
setMobileMenuOpen(false);
}, [location.pathname]);

const toggleDarkMode = () => {
setDarkMode((current) => !current);
};

return ( <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100"> <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95"> <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"> <Link
         to="/"
         className="flex items-center gap-3"
       > <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"> <BookOpen size={22} /> </div>

        <div>
          <div className="font-bold text-gray-900 dark:text-white">
            Design Patterns TR
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            C# Tasarım Kalıpları
          </div>
        </div>
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        <Link
          to="/"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            location.pathname === "/"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          Ana Sayfa
        </Link>

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Tema değiştir"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Tema değiştir"
          className="rounded-lg p-2 text-gray-600 dark:text-gray-300"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Menüyü aç"
          className="rounded-lg p-2 text-gray-600 dark:text-gray-300"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>

    {mobileMenuOpen && (
      <div className="border-t border-gray-200 px-4 py-4 md:hidden dark:border-gray-700">
        <Link
          to="/"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Ana Sayfa
        </Link>

        <div className="mt-2">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tasarım Kalıpları
          </div>

          {patterns.map((pattern) => (
            <Link
              key={pattern.id}
              to={`/pattern/${pattern.id}`}
              className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {pattern.name}
            </Link>
          ))}
        </div>
      </div>
    )}
  </header>

  <Outlet />

  <ChatPanel />

  <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        C# Design Patterns öğrenme projesi
      </p>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        İçerikler özgün Türkçe anlatımlarla hazırlanmıştır.
      </p>

      <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
       © 2026 Lara Nur Merve
      </p>
    </div>
  </footer>
</div>

);
};

export default Layout;
