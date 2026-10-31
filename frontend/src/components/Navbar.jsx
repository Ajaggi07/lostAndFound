"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageSearch,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const linkClass = (path) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      pathname === path
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <PackageSearch size={23} />
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Find</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Lost & Found Portal
            </p>
          </div>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/browse" className={linkClass("/browse")}>
            <Search size={17} />
            Browse Items
          </Link>

          <Link href="/report" className={linkClass("/report")}>
            <PlusCircle size={17} />
            Report Item
          </Link>

          {loggedIn ? (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              <LogIn size={17} />
              Login
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/browse"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/browse")}
            >
              Browse Items
            </Link>

            <Link
              href="/report"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/report")}
            >
              Report Item
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={linkClass("/dashboard")}
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/login")}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}