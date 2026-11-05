"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  BookOpen,
  CalendarDays,
  Loader2,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";

import type { IBorrow } from "@/types/borrow";

import { getMyBorrows, returnBorrowedBook } from "@/lib/book-api";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";

interface MyBorrowsTableProps {
  userEmail: string;
}

// FORMAT DATE
const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

// CHECK WHETHER A BORROW IS OVERDUE
// Uses the exact due timestamp, matching the previous behavior.
const isOverdue = (returnDate: string, currentTime: number | null): boolean => {
  if (currentTime === null) return false;

  const dueTime = new Date(returnDate).getTime();

  if (Number.isNaN(dueTime)) return false;

  return dueTime < currentTime;
};

export default function MyBorrowsTable({ userEmail }: MyBorrowsTableProps) {
  // STATE
  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const [returningBook, setReturningBook] = useState<IBorrow | null>(null);

  const [returning, setReturning] = useState(false);

  // FETCH AUTHENTICATED USER'S BORROWED BOOKS
  useEffect(() => {
    const controller = new AbortController();

    const fetchBorrows = async () => {
      try {
        const result = await getMyBorrows(controller.signal);

        if (controller.signal.aborted) return;

        if (!Array.isArray(result.borrows)) {
          throw new Error("Invalid backend response");
        }

        setBorrows(result.borrows as IBorrow[]);
        setCurrentTime(Date.now());
        setError("");
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch borrowed books",
        );

        // Avoid showing stale data after a failed refresh
        setBorrows([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchBorrows();

    return () => {
      controller.abort();
    };
  }, [userEmail, refreshKey]);

  // REFRESH BORROWED BOOKS
  const handleRefresh = () => {
    if (loading || returning) return;

    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  // RETURN BORROWED BOOK
  const handleReturn = async () => {
    if (!returningBook || returning) return;

    const borrowId = returningBook._id;

    try {
      setReturning(true);

      // JWT-authenticated DELETE request
      await returnBorrowedBook(borrowId);

      // Update UI only after successful backend response
      setBorrows((previous) =>
        previous.filter((borrow) => borrow._id !== borrowId),
      );

      setCurrentTime(Date.now());

      toast.success("Book returned successfully!");

      setReturningBook(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to return book",
      );
    } finally {
      setReturning(false);
    }
  };

  // BOOK COVER, TITLE AND AUTHOR
  const renderBook = (borrow: IBorrow) => (
    <Link
      href={`/books/${encodeURIComponent(borrow.bookId)}`}
      className="flex min-w-0 items-center gap-4"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-[#dce6dc] bg-[#eaf2e8]">
        {borrow.image ? (
          <Image
            src={borrow.image}
            alt={`${borrow.title} cover`}
            fill
            unoptimized
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-6 text-[#1d513b]" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate font-semibold text-[#1b3828] hover:underline">
          {borrow.title}
        </p>

        <p className="mt-1 truncate text-sm text-[#819084]">{borrow.author}</p>
      </div>
    </Link>
  );

  // DUE DATE AND OVERDUE STATUS
  const renderDueDate = (borrow: IBorrow) => {
    const overdue = isOverdue(borrow.returnDate, currentTime);

    return (
      <div className="space-y-2">
        <p className="text-sm text-[#31503b]">
          {formatDate(borrow.returnDate)}
        </p>

        <Badge
          variant="secondary"
          className={
            overdue ? "bg-red-50 text-red-600" : "bg-[#eaf2e8] text-[#1d513b]"
          }
        >
          {overdue ? "Overdue" : "Borrowed"}
        </Badge>
      </div>
    );
  };

  // COMPONENT UI
  return (
    <div className="w-full min-w-0 space-y-6">
      {/* COLLECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#1b3828]">
            Currently Reading
          </h2>

          <p className="mt-1 text-sm text-[#78877b]">
            {loading
              ? "Loading borrowed books..."
              : error
                ? "Unable to load borrowed books"
                : `${borrows.length} active ${
                    borrows.length === 1 ? "borrow" : "borrows"
                  }`}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || returning}
          className="border-[#dce6dc] text-[#1d513b]"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-20 w-14" />

                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        /* ERROR STATE */
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="space-y-4 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={returning}
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : borrows.length === 0 ? (
        /* EMPTY STATE */
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#eaf2e8]">
              <BookOpen className="size-8 text-[#1d513b]" />
            </div>

            <h3 className="font-serif text-2xl text-[#1b3828]">
              Your reading shelf is empty
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#78877b]">
              Explore the library and borrow a book to begin your next reading
              adventure.
            </p>

            {/* FIXED: ALL BOOKS PAGE */}
            <Link
              href="/books"
              className={cn(
                buttonVariants(),
                "mt-6 bg-[#1d513b] text-white hover:bg-[#153e2c]",
              )}
            >
              Explore Books
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <Card className="hidden min-w-0 gap-0 overflow-hidden rounded-2xl border-[#e1e8df] bg-white py-0 shadow-sm md:block">
            <Table>
              <TableHeader className="bg-[#f1f7ee]">
                <TableRow>
                  <TableHead className="w-[38%] px-5 py-5 text-[#31503b]">
                    Book
                  </TableHead>

                  <TableHead className="text-[#31503b]">Borrow Date</TableHead>

                  <TableHead className="text-[#31503b]">Return Date</TableHead>

                  <TableHead className="px-5 text-right text-[#31503b]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {borrows.map((borrow) => (
                  <TableRow key={borrow._id} className="border-[#edf1ea]">
                    <TableCell className="px-5 py-4">
                      {renderBook(borrow)}
                    </TableCell>

                    <TableCell className="text-sm text-[#607365]">
                      {formatDate(borrow.borrowDate)}
                    </TableCell>

                    <TableCell>{renderDueDate(borrow)}</TableCell>

                    <TableCell className="px-5 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={returning}
                        onClick={() => setReturningBook(borrow)}
                        className="border-[#cddfcf] text-[#1d513b] hover:bg-[#eaf2e8]"
                      >
                        <RotateCcw className="size-4" />
                        Return Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* MOBILE CARDS */}
          <div className="grid gap-4 md:hidden">
            {borrows.map((borrow) => (
              <Card
                key={borrow._id}
                className="gap-0 border-[#e1e8df] bg-white py-0"
              >
                <CardContent className="space-y-4 p-4">
                  {renderBook(borrow)}

                  <div className="grid grid-cols-2 gap-3 border-t border-[#edf1ea] pt-4">
                    {/* BORROW DATE */}
                    <div>
                      <p className="mb-1 flex items-center gap-1 text-xs text-[#819084]">
                        <CalendarDays className="size-3" />
                        Borrowed
                      </p>

                      <p className="text-sm text-[#31503b]">
                        {formatDate(borrow.borrowDate)}
                      </p>
                    </div>

                    {/* RETURN DATE */}
                    <div>
                      <p className="mb-1 text-xs text-[#819084]">Return by</p>

                      {renderDueDate(borrow)}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={returning}
                    className="w-full border-[#cddfcf] text-[#1d513b]"
                    onClick={() => setReturningBook(borrow)}
                  >
                    <RotateCcw className="size-4" />
                    Return Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* RETURN CONFIRMATION DIALOG */}
      <AlertDialog
        open={returningBook !== null}
        onOpenChange={(open) => {
          if (!open && !returning) {
            setReturningBook(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-[#dce6dc] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl text-[#1b3828]">
              Return this book?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to return{" "}
              <span className="font-semibold text-[#1d513b]">
                {returningBook?.title}
              </span>
              ? The book will become available for other readers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={returning}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={returning}
              onClick={(event) => {
                event.preventDefault();
                void handleReturn();
              }}
              className="bg-[#1d513b] text-white hover:bg-[#153e2c]"
            >
              {returning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Returning...
                </>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  Confirm Return
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
