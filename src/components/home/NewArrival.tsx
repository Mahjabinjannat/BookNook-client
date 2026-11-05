"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ArrowRight, BookOpen, Sparkles, RefreshCw } from "lucide-react";

import type { IBook } from "@/types/book";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

export default function NewArrivals() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNewArrivals = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Backend API URL is missing");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/books/new-arrivals`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }

        const result: IBook[] = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Invalid backend response");
        }

        if (!controller.signal.aborted) {
          setBooks(result);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Failed to fetch new arrivals",
        );

        setLoading(false);
      }
    };

    void fetchNewArrivals();

    return () => controller.abort();
  }, [refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="w-full bg-[#f8faf6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#739078]">
              <Sparkles className="size-4" />
              Fresh on the shelf
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#1b3828] sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#718474] sm:text-base">
              New stories are waiting to be discovered. Explore the latest books
              shared by our readers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!loading && !error && (
              <Badge
                variant="secondary"
                className="bg-[#e7f0e5] px-3 py-1 text-[#315b40]"
              >
                {books.length} latest books
              </Badge>
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading}
              onClick={handleRefresh}
              aria-label="Refresh new arrivals"
              className="border-[#dce6dc] bg-white text-[#1d513b]"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="gap-0 overflow-hidden border-[#dce6dc] bg-white py-0"
              >
                <Skeleton className="h-64 w-full rounded-none" />

                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          /* ERROR STATE */
          <Card className="border-[#dce6dc] bg-white">
            <CardContent className="flex flex-col items-center py-14 text-center">
              <BookOpen className="mb-4 size-10 text-[#1d513b]" />

              <p className="text-sm text-red-600">{error}</p>

              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-5"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : books.length === 0 ? (
          /* EMPTY STATE */
          <Card className="border-[#dce6dc] bg-white">
            <CardContent className="flex flex-col items-center py-14 text-center">
              <BookOpen className="mb-4 size-10 text-[#1d513b]" />

              <h3 className="font-serif text-xl text-[#1b3828]">
                Our shelves are waiting
              </h3>

              <p className="mt-2 text-sm text-[#718474]">
                No books have been added yet. Check back soon for new arrivals.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* BOOK CARDS */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card
                key={book._id}
                className="group flex min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border-[#dce6dc] bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#bdd2bf] hover:shadow-lg"
              >
                {/* BOOK COVER */}
                <Link
                  href={`/books/${book._id}`}
                  aria-label={`View details for ${book.title}`}
                  className="relative block h-64 overflow-hidden bg-[#eaf2e8] p-6"
                >
                  <div className="relative mx-auto h-full w-full max-w-[150px] overflow-hidden rounded-md bg-white shadow-[8px_10px_20px_rgba(29,81,59,0.15)] transition-transform duration-300 group-hover:scale-105">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={`${book.title} cover`}
                        fill
                        unoptimized
                        sizes="150px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="size-12 text-[#77927d]" />
                      </div>
                    )}
                  </div>

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#1d513b] shadow-sm">
                    New Arrival
                  </span>
                </Link>

                {/* BOOK INFO */}
                <CardContent className="flex flex-1 flex-col p-5">
                  <Badge
                    variant="secondary"
                    className="mb-3 w-fit border-0 bg-[#eaf2e8] text-[#315b40]"
                  >
                    {book.category}
                  </Badge>

                  <Link
                    href={`/books/${book._id}`}
                    className="font-serif text-xl font-semibold text-[#1b3828] hover:text-[#34704d]"
                  >
                    {book.title}
                  </Link>

                  <p className="mt-2 text-sm text-[#819084]">
                    by {book.author}
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/books/${book._id}`}
                      className={cn(
                        buttonVariants(),
                        "flex h-11 w-full items-center justify-center gap-2 bg-[#1d513b] text-white hover:bg-[#153e2c]",
                      )}
                    >
                      View Details
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* SEE ALL BOOKS */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-full border-[#b9d0bd] bg-white px-8 text-[#1d513b] hover:bg-[#eaf2e8]",
            )}
          >
            See All Books
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
