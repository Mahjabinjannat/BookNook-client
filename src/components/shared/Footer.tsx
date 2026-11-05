import Link from "next/link";

import { BookOpen, ArrowUpRight, Mail, MapPin, Heart } from "lucide-react";

import { FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const categories = [
  { label: "Fiction", href: "/books?category=Fiction" },
  { label: "Science", href: "/books?category=Science" },
  { label: "History", href: "/books?category=History" },
  { label: "Kids", href: "/books?category=Kids" },
  { label: "Others", href: "/books?category=Others" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#163c2e] text-[#e8efe6]">
      {/* TOP DECORATIVE LINE */}
      <div className="h-1 w-full bg-gradient-to-r from-[#163c2e] via-[#c8a46b] to-[#163c2e]" />

      <div className="mx-auto w-full max-w-7xl px-5 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 border-b border-white/15 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.1fr] lg:gap-10">
          {/* BRAND */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex size-12 items-center justify-center rounded-2xl bg-[#e8f0e5]">
                <BookOpen className="size-6 text-[#1d513b]" strokeWidth={1.8} />

                <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[#c8a46b]" />
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-[#f8f7f0]">
                  BookNook
                </h2>

                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-[#b7c9b9]">
                  A small library for big readers
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-[#c2d1c3]">
              A cozy corner for curious minds and unforgettable stories.
              Discover new worlds, share your favorites, and keep the joy of
              reading alive.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#e4eee2] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a46b] hover:bg-[#c8a46b] hover:text-[#163c2e]"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-3 h-0.5 w-9 rounded-full bg-[#c8a46b]" />

            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#c2d1c3] transition-colors hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Explore Genres
            </h3>

            <div className="mt-3 h-0.5 w-9 rounded-full bg-[#c8a46b]" />

            <ul className="mt-6 space-y-3.5">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#c2d1c3] transition-colors hover:text-white"
                  >
                    <span>{category.label}</span>

                    <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Get in Touch
            </h3>

            <div className="mt-3 h-0.5 w-9 rounded-full bg-[#c8a46b]" />

            <p className="mt-6 text-sm leading-7 text-[#c2d1c3]">
              Have a question or a book recommendation? We&apos;d love to hear from
              you.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="mailto:hello@booknook.app"
                className="flex items-start gap-3 text-sm text-[#c2d1c3] transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-[#c8a46b]" />

                <span className="break-all">hello@booknook.app</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-[#c2d1c3]">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#c8a46b]" />

                <span>Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#b7c9b9]">
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-[#b7c9b9]">
            Made with
            <Heart className="size-3.5 fill-[#c8a46b] text-[#c8a46b]" />
            for the love of reading.
          </p>
        </div>
      </div>
    </footer>
  );
}
