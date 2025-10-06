"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Code2, User, LogOut, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  const [openLang, setOpenLang] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openLang &&
        langRef.current &&
        !langRef.current.contains(event.target as Node)
      ) {
        setOpenLang(false);
      }
      if (
        openUser &&
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setOpenUser(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openLang, openUser]);

  const handleSignOut = () => {
    logout();
  };

  const handleChangeLocale = (lang: string) => {
    document.cookie = `locale=${lang}; path=/`;
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Code2 className="h-7 w-7 text-violet-600" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            CodeSnippets
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4 ">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-gray-900 font-semibold text-sm transition hover:bg-violet-50 hover:text-violet-700
      ${pathname === "/" ? "bg-violet-100 text-violet-700" : ""}`}
          >
            {t("snippets")}
          </Link>

          {user && (
            <>
              <Link
                href="/my-snippets"
                className={`px-3 py-2 rounded-lg text-gray-900 font-semibold text-sm transition hover:bg-violet-50 hover:text-violet-700
      ${pathname === "/my-snippets" ? "bg-violet-100 text-violet-700" : ""}`}
              >
                {t("mySnippets")}
              </Link>
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-medium shadow transition"
              >
                <Plus className="h-5 w-5" />
                {t("addnew")}
              </Link>
            </>
          )}

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setOpenLang(!openLang)}
              className="p-2 rounded-full hover:bg-violet-50 transition border border-gray-200 cursor-pointer"
              aria-label="Change language"
            >
              <Globe className="h-5 w-5 text-gray-700" />
            </button>
            {openLang && (
              <div className="absolute right-0 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg text-sm overflow-hidden animate-fade-in">
                {["en", "vi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      handleChangeLocale(lang);
                      setOpenLang(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-violet-50 transition cursor-pointer ${
                      locale === lang
                        ? "text-violet-600 font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {lang === "en" && t("english")}
                    {lang === "vi" && t("vietnamese")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setOpenUser(!openUser)}
                className="p-2 rounded-full hover:bg-violet-50 transition border border-gray-200 cursor-pointer"
                aria-label="User menu"
              >
                <User className="h-5 w-5 text-gray-700" />
              </button>
              {openUser && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border-gray-200 border bg-white shadow-lg text-sm overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      setOpenUser(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-violet-50 text-gray-700 cursor-pointer font-semibold"
                  >
                    <User className="h-4 w-4" /> {user.name}
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-violet-50 text-gray-700 cursor-pointer font-semibold"
                  >
                    <LogOut className="h-4 w-4" /> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold shadow transition"
            >
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
