"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ArrowRight,
  BookOpen,
  Search,
  SlidersHorizontal,
  RefreshCw,
  LibraryBig,
  X,
} from "lucide-react";

import type { IBook } from "@/types/book";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

const categories = [
  "All Categories",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

type Category = (typeof categories)[number];

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "copies-desc";

function getValidCategory(value: string | null): Category {
  if (value && categories.some((category) => category === value)) {
    return value as Category;
  }

  return "All Categories";
}

export default function AllBooks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // CATEGORY IS READ DIRECTLY FROM THE URL
  const category = getValidCategory(searchParams.get("category"));

  // FETCH ALL BOOKS
  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Backend API URL is missing");
        }

        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/books`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const result = await response.json();

        // SUPPORT BOTH ARRAY AND { books: [...] }
        const bookList: IBook[] = Array.isArray(result) ? result : result.books;

        if (!Array.isArray(bookList)) {
          throw new Error("Invalid backend response");
        }

        if (!controller.signal.aborted) {
          setBooks(bookList);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err instanceof Error ? err.message : "Failed to fetch books");

        setLoading(false);
      }
    };

    void fetchBooks();

    return () => controller.abort();
  }, [refreshKey]);

  // UPDATE CATEGORY IN URL
  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // SEARCH + FILTER + SORT
  const filteredBooks = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const result = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);

      const matchesCategory =
        category === "All Categories" || book.category === category;

      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );

        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "copies-desc":
          return b.totalCopies - a.totalCopies;

        case "newest":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return result;
  }, [books, search, category, sortBy]);

  // REFRESH
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  // CLEAR FILTERS
  const resetFilters = () => {
    setSearch("");
    setSortBy("newest");
    handleCategoryChange("All Categories");
  };

  const filtersActive =
    search.trim() !== "" ||
    category !== "All Categories" ||
    sortBy !== "newest";

  return (
    <div className="w-full min-w-0 space-y-8">
      {/* COLLECTION HEADING */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6c8a73]">
            <LibraryBig className="size-4" />
            Our Collection
          </div>

          <h2 className="font-serif text-3xl font-semibold text-[#1b3828]">
            Discover Books
          </h2>

          <p className="mt-2 text-sm text-[#78877b]">
            {loading
              ? "Loading our collection..."
              : `Showing ${filteredBooks.length} of ${books.length} books`}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="border-[#dce6dc] bg-white text-[#1d513b]"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <Card className="gap-0 border-[#dce6dc] bg-white py-0 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
            {/* SEARCH */}
            <div className="relative min-w-0">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8b9b8d]" />

              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or author..."
                className="h-11 w-full border-[#dce6dc] bg-[#fbfcfa] pl-10 text-[#1b3828] focus-visible:ring-[#8aaf91]"
              />
            </div>

            {/* CATEGORY */}
            <Select
              value={category}
              onValueChange={(value) => {
                if (value) {
                  handleCategoryChange(value);
                }
              }}
            >
              <SelectTrigger className="h-11! w-full border-[#dce6dc] bg-[#fbfcfa]">
                <SlidersHorizontal className="size-4 text-[#68836d]" />
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* SORT */}
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (value) {
                  setSortBy(value as SortOption);
                }
              }}
            >
              <SelectTrigger className="h-11! w-full border-[#dce6dc] bg-[#fbfcfa]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>

                <SelectItem value="oldest">Oldest First</SelectItem>

                <SelectItem value="title-asc">Title: A to Z</SelectItem>

                <SelectItem value="title-desc">Title: Z to A</SelectItem>

                <SelectItem value="copies-desc">Most Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CATEGORY QUICK FILTERS */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#edf1ea] pt-4">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={category === item ? "default" : "outline"}
                onClick={() => handleCategoryChange(item)}
                className={cn(
                  "rounded-full px-4 text-xs",
                  category === item
                    ? "bg-[#1d513b] text-white hover:bg-[#153e2c]"
                    : "border-[#dce6dc] bg-white text-[#617466] hover:bg-[#f1f7ee]",
                )}
              >
                {item}
              </Button>
            ))}

            {filtersActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto text-[#718474]"
              >
                <X className="size-3.5" />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="gap-0 overflow-hidden border-[#dce6dc] bg-white py-0"
            >
              <Skeleton className="aspect-square w-full rounded-none" />

              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-20" />
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
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BookOpen className="mb-5 size-12 text-[#1d513b]" />

            <h3 className="font-serif text-2xl text-[#1b3828]">
              Unable to load books
            </h3>

            <p className="mt-3 text-sm text-red-600">{error}</p>

            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              className="mt-6"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredBooks.length === 0 ? (
        /* EMPTY STATE */
        <Card className="border-[#dce6dc] bg-white">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#eaf2e8]">
              <Search className="size-7 text-[#1d513b]" />
            </div>

            <h3 className="font-serif text-2xl text-[#1b3828]">
              No books found
            </h3>

            <p className="mt-3 max-w-md text-sm text-[#78877b]">
              {books.length === 0
                ? "No books have been added to the library yet."
                : "Try a different search or category to discover more books."}
            </p>

            {filtersActive && (
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="mt-6"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* BOOK GRID */
        <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => {
            const available = book.totalCopies > 0;

            return (
              <Card
                key={book._id}
                className="group flex min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border-[#dce6dc] bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#bdd2bf] hover:shadow-lg"
              >
                {/* BOOK IMAGE */}
                <Link
                  href={`/books/${book._id}`}
                  aria-label={`View details for ${book.title}`}
                  className="relative block aspect-square overflow-hidden bg-[#eaf2e8] p-6"
                >
                  <div className="relative mx-auto h-full w-full max-w-[190px] overflow-hidden rounded-md bg-white shadow-[8px_12px_20px_rgba(29,81,59,0.15)] transition-transform duration-300 group-hover:scale-[1.04]">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={`${book.title} cover`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 80vw, 190px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="size-12 text-[#77927d]" />
                      </div>
                    )}
                  </div>

                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm",
                      available
                        ? "bg-white text-[#1d513b]"
                        : "bg-[#fff0f0] text-[#b44747]",
                    )}
                  >
                    {available
                      ? `${book.totalCopies} available`
                      : "Not Available"}
                  </span>
                </Link>

                {/* BOOK DETAILS */}
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-3">
                    <Badge
                      variant="secondary"
                      className="border-0 bg-[#eaf2e8] text-[11px] text-[#315b40]"
                    >
                      {book.category}
                    </Badge>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="font-serif text-xl font-semibold leading-snug text-[#1b3828] transition-colors hover:text-[#34704d]"
                  >
                    {book.title}
                  </Link>

                  <p className="mt-2 text-sm text-[#819084]">
                    by {book.author}
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#718474]">
                    {book.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/books/${book._id}`}
                      className={cn(
                        buttonVariants(),
                        "flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1d513b] text-sm text-white hover:bg-[#153e2c]",
                      )}
                    >
                      View Book Details
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
