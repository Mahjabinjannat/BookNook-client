
import { Suspense } from "react";
import type { Metadata } from "next";

import AllBooks from "@/components/books/AllBooks";

export const metadata: Metadata = {
  title: "All Books | BookNook",
  description: "Explore books shared by the BookNook community.",
};

export default function AllBooksPage() {
  return (
    <main className="min-h-screen w-full min-w-0 bg-[#f8faf6]">
      {/* PAGE HEADER */}
      <section className="border-b border-[#dce6dc] bg-[#eaf2e8] px-4 py-14 text-center sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#6d8a72]">
          The BookNook Collection
        </p>

        <h1 className="font-serif text-4xl font-bold text-[#1b3828] sm:text-5xl lg:text-6xl">
          Explore Our Library
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#687b6b] sm:text-base">
          Discover stories worth sharing, explore new ideas,
          and find the perfect book for your next reading adventure.
        </p>
      </section>

      {/* BOOK COLLECTION */}
      <section className="mx-auto w-full max-w-7xl min-w-0 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Suspense
          fallback={
            <div className="py-16 text-center text-[#718474]">
              Loading books...
            </div>
          }
        >
          <AllBooks />
        </Suspense>
      </section>
    </main>
  );
}
