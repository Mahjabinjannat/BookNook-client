"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import type { IBook } from "@/types/book";
import { apiFetch } from "@/lib/api-client";
import EditBookDialog from "./EditBookDialog";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

interface MyBooksTableProps {
  userEmail: string;
}

interface MyBooksResponse {
  success: boolean;
  books?: IBook[];
  message?: string;
}

interface DeleteBookResponse {
  success?: boolean;
  deletedCount?: number;
  message?: string;
}

export default function MyBooksTable({ userEmail }: MyBooksTableProps) {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingBook, setEditingBook] = useState<IBook | null>(null);

  const [deletingBook, setDeletingBook] = useState<IBook | null>(null);

  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH MY BOOKS WITH JWT
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userEmail) {
          throw new Error("User email is missing");
        }

        const response = await apiFetch(
          `/my-books?email=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result: MyBooksResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch books");
        }

        if (!Array.isArray(result.books)) {
          throw new Error("Invalid backend response");
        }

        if (!controller.signal.aborted) {
          setBooks(result.books);
          setError("");
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        const message =
          err instanceof Error ? err.message : "Failed to fetch books";

        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchMyBooks();

    return () => {
      controller.abort();
    };
  }, [userEmail, refreshKey]);

  // ==========================================
  // REFRESH BOOKS
  // ==========================================

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  // ==========================================
  // DELETE BOOK WITH JWT
  // ==========================================

  const handleDelete = async () => {
    if (!deletingBook || deleting) return;

    const bookId = deletingBook._id;

    setDeleting(true);

    try {
      const response = await apiFetch(`/my-books/${bookId}`, {
        method: "DELETE",
      });

      const result: DeleteBookResponse = await response.json();

      const deletedSuccessfully =
        response.ok && (result.deletedCount === 1 || result.success === true);

      if (!deletedSuccessfully) {
        throw new Error(result.message || "Failed to delete book");
      }

      // Remove the deleted book from the UI
      setBooks((previous) => previous.filter((book) => book._id !== bookId));

      toast.success("Book deleted successfully");
      setDeletingBook(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // BOOK INFORMATION
  // ==========================================

  const renderBookInfo = (book: IBook) => (
    <Link
      href={`/books/${book._id}`}
      className="flex min-w-0 items-center gap-4"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-[#dce5da] bg-[#f5f7f3]">
        {book.image ? (
          <Image
            src={book.image}
            alt={`${book.title} cover`}
            fill
            unoptimized
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-6 text-[#8da493]" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-[#1b3828] hover:underline">
          {book.title}
        </p>

        <p className="mt-1 truncate text-sm text-[#819084]">{book.author}</p>
      </div>
    </Link>
  );

  // ==========================================
  // EDIT AND DELETE BUTTONS
  // ==========================================

  const renderActions = (book: IBook) => (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setEditingBook(book)}
        className="h-10 gap-2 rounded-xl border-[#dce6dc] bg-white px-3 text-[#5d8271] hover:bg-[#edf4eb] hover:text-[#1d513b]"
      >
        <Pencil className="size-4" />
        Edit
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setDeletingBook(book)}
        className="h-10 gap-2 rounded-xl bg-red-50 px-3 text-red-500 hover:bg-red-100 hover:text-red-600"
      >
        <Trash2 className="size-4" />
        Delete
      </Button>
    </div>
  );

  // ==========================================
  // COMPONENT UI
  // ==========================================

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* COLLECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#1b3828]">
            Your Collection
          </h2>

          <p className="mt-1 text-sm text-[#78877b]">
            {loading
              ? "Loading your books..."
              : `${books.length} ${
                  books.length === 1 ? "book" : "books"
                } in your collection`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* REFRESH */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh books"
            className="border-[#dce5da] text-[#1d513b]"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {/* ADD BOOK */}
          <Link
            href="/add-book"
            className={cn(
              buttonVariants({ variant: "default" }),
              "gap-2 bg-[#1d513b] text-white hover:bg-[#153e2c]",
            )}
          >
            <Plus className="size-4" />
            Add Book
          </Link>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-20 w-14 shrink-0 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>

                <Skeleton className="hidden h-9 w-28 sm:block" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        /* ERROR */
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button variant="outline" onClick={handleRefresh}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : books.length === 0 ? (
        /* EMPTY COLLECTION */
        <Card className="border-[#e1e8df] bg-white">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#e8f1e7]">
              <BookOpen className="size-8 text-[#1d513b]" />
            </div>

            <h3 className="font-serif text-xl font-semibold text-[#1b3828]">
              No books added yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#78877b]">
              Your collection is empty. Add your first book to share it with the
              library.
            </p>

            <Link
              href="/add-book"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "mt-6 gap-2 bg-[#1d513b] text-white hover:bg-[#153e2c]",
              )}
            >
              <Plus className="size-4" />
              Add Your First Book
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <Card className="hidden min-w-0 gap-0 overflow-hidden rounded-2xl border-[#e1e8df] bg-white py-0 shadow-sm md:block">
            <Table>
              <TableHeader className="bg-[#f3f7f1]">
                <TableRow className="border-[#e1e8df] hover:bg-transparent">
                  <TableHead className="w-[48%] px-5 py-5 font-serif text-base font-semibold text-[#31503b]">
                    Book
                  </TableHead>

                  <TableHead className="px-4 font-serif text-base font-semibold text-[#31503b]">
                    Category
                  </TableHead>

                  <TableHead className="px-4 font-serif text-base font-semibold text-[#31503b]">
                    Copies
                  </TableHead>

                  <TableHead className="px-5 text-right font-serif text-base font-semibold text-[#31503b]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {books.map((book) => (
                  <TableRow
                    key={book._id}
                    className="border-[#e9eee7] transition hover:bg-[#f8faf6]"
                  >
                    <TableCell className="px-5 py-4">
                      {renderBookInfo(book)}
                    </TableCell>

                    <TableCell className="px-4">
                      <Badge
                        variant="secondary"
                        className="rounded-lg bg-[#eaf2e8] px-3 py-1 text-sm font-medium text-[#1d513b]"
                      >
                        {book.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 text-sm text-[#3c5042]">
                      {book.totalCopies}
                    </TableCell>

                    <TableCell className="px-5">
                      {renderActions(book)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* MOBILE CARDS */}
          <div className="grid gap-4 md:hidden">
            {books.map((book) => (
              <Card
                key={book._id}
                className="gap-0 rounded-2xl border-[#e1e8df] bg-white py-0 shadow-sm"
              >
                <CardContent className="space-y-4 p-4">
                  {renderBookInfo(book)}

                  <div className="flex items-center justify-between border-y border-[#edf1ea] py-3">
                    <Badge
                      variant="secondary"
                      className="bg-[#eaf2e8] text-[#1d513b]"
                    >
                      {book.category}
                    </Badge>

                    <span className="text-sm text-[#526657]">
                      {book.totalCopies}{" "}
                      {book.totalCopies === 1 ? "copy" : "copies"}
                    </span>
                  </div>

                  {renderActions(book)}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* EDIT DIALOG */}
      {editingBook && (
        <EditBookDialog
          key={editingBook._id}
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onUpdated={handleRefresh}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deletingBook}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeletingBook(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-[#e1e8df] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-[#1b3828]">
              Delete this book?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#1b3828]">
                {deletingBook?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete Book
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
