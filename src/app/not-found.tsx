import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Home,
  SearchX,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#f8faf6] px-5 py-16 sm:px-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 size-80 rounded-full bg-[#e3eee2] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-[#edf1dc] opacity-70 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Decorative label */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8e6d7] bg-white px-5 py-2.5 shadow-sm">
          <Sparkles className="size-4 text-[#c8a46b]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#54725b]">
            A Little Lost in the Library?
          </span>
        </div>

        {/* 404 Illustration */}
        <div className="relative mx-auto flex h-56 max-w-md items-center justify-center sm:h-72">
          {/* Decorative rings */}
          <div className="absolute size-52 rounded-full border border-[#dce8d9] sm:size-64" />
          <div className="absolute size-40 rounded-full border border-dashed border-[#c9d9c5] sm:size-52" />

          {/* Main 404 number */}
          <div className="relative flex items-center justify-center gap-1 sm:gap-3">
            <span className="select-none text-[110px] font-black leading-none tracking-tighter text-[#1d513b] sm:text-[155px]">
              4
            </span>

            {/* Book illustration replacing zero */}
            <div className="relative flex size-24 items-center justify-center rounded-full border-[5px] border-[#1d513b] bg-[#eaf2e8] shadow-[0_10px_35px_rgba(29,81,59,0.12)] sm:size-32">
              <BookOpen
                className="size-12 text-[#1d513b] sm:size-16"
                strokeWidth={1.6}
              />

              <div className="absolute -right-2 -top-3 flex size-9 items-center justify-center rounded-full bg-[#c8a46b] shadow-md sm:size-11">
                <SearchX className="size-4 text-white sm:size-5" />
              </div>
            </div>

            <span className="select-none text-[110px] font-black leading-none tracking-tighter text-[#1d513b] sm:text-[155px]">
              4
            </span>
          </div>

          {/* Small floating decorations */}
          <div className="absolute left-6 top-8 flex size-9 -rotate-12 items-center justify-center rounded-xl bg-[#e7eddf] shadow-sm sm:left-12">
            <BookOpen className="size-5 text-[#78947b]" />
          </div>

          <div className="absolute bottom-6 right-7 flex size-10 rotate-12 items-center justify-center rounded-xl bg-[#f4ead7] shadow-sm sm:right-12">
            <Sparkles className="size-5 text-[#bd985a]" />
          </div>
        </div>

        {/* Message */}
        <div className="mt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#b08b53]">
            Page Not Found
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#1b3828] sm:text-4xl md:text-5xl">
            Oops! This Page Is
            <span className="block text-[#4c805d]">
              Missing From Our Shelves
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#728375] sm:text-base">
            It seems the page you&apos;re looking for has been misplaced, moved,
            or never existed. But don&apos;t worry, there are plenty of
            wonderful stories waiting to be discovered.
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d513b] px-7 text-sm font-semibold text-white shadow-[0_5px_18px_rgba(29,81,59,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#153e2c] hover:shadow-lg sm:w-auto"
          >
            <Home className="size-4" />
            Back to Home
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/books"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#cbdccc] bg-white px-7 text-sm font-semibold text-[#1d513b] transition-all duration-300 hover:border-[#1d513b] hover:bg-[#eaf2e8] sm:w-auto"
          >
            <BookOpen className="size-4" />
            Explore All Books
          </Link>
        </div>

        {/* Bottom message */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-[#d4dfd2]" />

          <p className="text-xs italic text-[#95a395]">
            Every great story deserves the right page.
          </p>

          <div className="h-px w-10 bg-[#d4dfd2]" />
        </div>
      </div>
    </main>
  );
}
