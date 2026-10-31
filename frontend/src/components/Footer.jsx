"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">

        {/* Branding */}
        <div>
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            Campus<span className="text-blue-400">Find</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            A campus lost and found platform that helps students
            reconnect with their lost belongings and return
            misplaced items to their rightful owners.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/" className="transition hover:text-blue-400">
                Home
              </Link>
            </li>

            <li>
              <Link href="/browse" className="transition hover:text-blue-400">
                Browse Items
              </Link>
            </li>

            <li>
              <Link href="/report" className="transition hover:text-blue-400">
                Report an Item
              </Link>
            </li>

            <li>
              <Link href="/dashboard" className="transition hover:text-blue-400">
                Dashboard
              </Link>
            </li>

            <li>
              <Link href="/login" className="transition hover:text-blue-400">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Purpose */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Our Purpose
          </h3>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            We aim to make campus life easier by providing a
            simple and reliable way to report lost belongings,
            discover found items, and connect students.
          </p>

          <p className="mt-4 text-sm font-semibold text-blue-400">
            Lost something? Find it here.
          </p>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-400">
        © {year} CampusFind. Built for the campus community.
      </div>
    </footer>
  );
}