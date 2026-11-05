// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { checkBorrowStatus } from "@/lib/book-api";
// import {
//   ArrowLeft,
//   ArrowRight,
//   BookOpen,
//   Check,
//   Clock3,
//   RefreshCw,
//   UserRound,
//   Bookmark,
// } from "lucide-react";

// import type { IBook } from "@/types/book";
// import BorrowBookDialog from "./BorrowBookDialog";

// import { Button, buttonVariants } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { cn } from "@/lib/utils";

// interface BookDetailsProps {
//   bookId: string;
//   userName: string;
//   userEmail: string;
// }

// export default function BookDetails({
//   bookId,
//   userName,
//   userEmail,
// }: BookDetailsProps) {
//   const [book, setBook] = useState<IBook | null>(null);
//   const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchBookDetails = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//         if (!apiUrl) {
//           throw new Error("Backend API URL is missing");
//         }

//         const baseUrl = apiUrl.replace(/\/$/, "");

//         const response = await fetch(`${baseUrl}/books/${bookId}`, {
//           method: "GET",
//           cache: "no-store",
//           signal: controller.signal,
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch book details");
//         }

//         const bookData: IBook | null = await response.json();

//         if (!bookData?._id) {
//           throw new Error("Book not found");
//         }

//         let borrowed = false;

//         if (userEmail) {
//           try {
//             const borrowData = await checkBorrowStatus(bookId);

//             borrowed = Boolean(borrowData.alreadyBorrowed);
//           } catch (borrowError) {
//             if (controller.signal.aborted) return;

//             console.error("Could not check borrowing status:", borrowError);

//             // Don't silently treat an authentication failure
//             // as confirmation that the book was not borrowed.
//             throw borrowError;
//           }
//         }

//         if (!controller.signal.aborted) {
//           setBook(bookData);
//           setAlreadyBorrowed(borrowed);
//           setError("");
//           setLoading(false);
//         }
//       } catch (error) {
//         if (controller.signal.aborted) return;

//         setError(
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch book details",
//         );

//         setLoading(false);
//       }
//     };

//     void fetchBookDetails();

//     return () => controller.abort();
//   }, [bookId, userEmail, refreshKey]);

//   const handleRefresh = () => {
//     setLoading(true);
//     setError("");
//     setRefreshKey((previous) => previous + 1);
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-[#f8faf6]">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//           <Skeleton className="mb-10 h-5 w-36" />

//           <div className="grid gap-10 lg:grid-cols-2">
//             <Skeleton className="min-h-[650px] rounded-3xl" />

//             <div className="space-y-6">
//               <Skeleton className="h-6 w-24" />
//               <Skeleton className="h-16 w-3/4" />
//               <Skeleton className="h-6 w-1/2" />
//               <Skeleton className="h-40 w-full" />
//               <Skeleton className="h-64 w-full" />
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !book) {
//     return (
//       <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf6] px-4">
//         <div className="w-full max-w-md rounded-3xl border border-[#dce6dc] bg-white px-8 py-14 text-center">
//           <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#eaf2e8]">
//             <BookOpen className="size-8 text-[#1d513b]" />
//           </div>

//           <h2 className="font-serif text-3xl font-semibold text-[#1b3828]">
//             Book unavailable
//           </h2>

//           <p className="mt-3 text-sm text-red-600">
//             {error || "Book not found"}
//           </p>

//           <Button variant="outline" onClick={handleRefresh} className="mt-6">
//             <RefreshCw className="size-4" />
//             Try Again
//           </Button>
//         </div>
//       </main>
//     );
//   }

//   const available = book.totalCopies > 0;

//   return (
//     <main className="min-h-screen bg-[#f8faf6]">
//       <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
//         {/* BACK LINK */}
//         <Link
//           href="/books"
//           className="group inline-flex items-center gap-2 text-sm font-medium text-[#708474] transition-colors hover:text-[#1d513b]"
//         >
//           <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
//           Back to all books
//         </Link>

//         {/* MAIN GRID */}
//         <div className="mt-8 grid min-w-0 items-stretch gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
//           {/* LEFT SIDE */}
//           <section className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#dce6dc] bg-[#e8f0e6] p-6 sm:p-10 lg:p-12">
//             <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full border border-[#d2e2d1]" />

//             <div className="pointer-events-none absolute -bottom-32 -left-28 size-80 rounded-full border border-[#d2e2d1]" />

//             <div className="relative z-10 flex items-center justify-between gap-3">
//               <span className="text-[11px] font-semibold tracking-[0.22em] text-[#607b67] uppercase">
//                 BookNook Collection
//               </span>

//               <Bookmark className="size-5 text-[#688a71]" />
//             </div>

//             <div className="relative z-10 flex flex-1 items-center justify-center py-12 lg:py-16">
//               <div className="relative aspect-[2/3] w-full max-w-[360px] overflow-hidden rounded-r-xl rounded-l-sm bg-white shadow-[18px_24px_45px_rgba(29,81,59,0.20)]">
//                 {book.image ? (
//                   <Image
//                     src={book.image}
//                     alt={`${book.title} cover`}
//                     fill
//                     unoptimized
//                     sizes="(max-width: 1024px) 80vw, 360px"
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center">
//                     <BookOpen className="size-16 text-[#8aa18e]" />
//                   </div>
//                 )}

//                 <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-linear-to-r from-black/15 to-transparent" />
//               </div>
//             </div>

//             <div className="relative z-10 flex items-center justify-center gap-3">
//               <span className="h-px w-8 bg-[#9cb4a0]" />

//               <p className="text-center text-[11px] font-medium tracking-[0.2em] text-[#718a76] uppercase">
//                 Every book has a story
//               </p>

//               <span className="h-px w-8 bg-[#9cb4a0]" />
//             </div>
//           </section>

//           {/* RIGHT SIDE */}
//           <section className="flex h-full min-w-0 flex-col">
//             {/* BOOK HEADER */}
//             <div>
//               <Badge className="border-0 bg-[#e4eee1] px-3 py-1 text-xs font-medium text-[#1d513b]">
//                 {book.category}
//               </Badge>

//               <h1 className="mt-5 font-serif text-4xl leading-[1.12] font-bold tracking-tight text-[#1b3828] sm:text-5xl lg:text-[54px]">
//                 {book.title}
//               </h1>

//               <p className="mt-4 text-base text-[#7a8d7d] sm:text-lg">
//                 by{" "}
//                 <span className="font-medium text-[#31503b]">
//                   {book.author}
//                 </span>
//               </p>
//             </div>

//             {/* DESCRIPTION */}
//             <div className="mt-8 border-t border-[#dce6dc] pt-7">
//               <h2 className="font-serif text-2xl font-semibold text-[#1b3828]">
//                 About this book
//               </h2>

//               <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#617466]">
//                 {book.description}
//               </p>
//             </div>

//             {/* BOTTOM SECTION */}
//             <div className="mt-auto pt-9">
//               {/* SHARED BY */}
//               <div className="flex items-center gap-4 border-t border-[#dce6dc] py-6">
//                 <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e5efe3]">
//                   <UserRound className="size-5 text-[#1d513b]" />
//                 </div>

//                 <div className="flex min-w-0 flex-col justify-center gap-1">
//                   <p className="text-xs leading-5 font-medium text-[#819084]">
//                     Shared by
//                   </p>

//                   <p className="text-base leading-6 font-semibold text-[#1b3828]">
//                     {book.userName}
//                   </p>

//                   <p className="break-all text-sm leading-5 text-[#819084]">
//                     {book.userEmail}
//                   </p>
//                 </div>
//               </div>

//               {/* AVAILABILITY CARD */}
//               <div className="overflow-hidden rounded-2xl border border-[#dce6dc] bg-white shadow-sm">
//                 {/* CARD HEADER */}
//                 <div className="flex min-h-[88px] flex-wrap items-center justify-between gap-4 border-b border-[#e8eee6] px-6 py-5">
//                   <h3 className="font-serif text-xl leading-7 font-semibold text-[#1b3828]">
//                     Book availability
//                   </h3>

//                   <span
//                     className={cn(
//                       "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-xs leading-none font-medium",
//                       available
//                         ? "bg-[#e8f5e9] text-[#287447]"
//                         : "bg-[#fff0f0] text-[#b44747]",
//                     )}
//                   >
//                     <span
//                       className={cn(
//                         "size-2 shrink-0 rounded-full",
//                         available ? "bg-[#36a36b]" : "bg-[#d55c5c]",
//                       )}
//                     />

//                     {available ? "Available" : "Not Available"}
//                   </span>
//                 </div>

//                 {/* INFORMATION GRID */}
//                 <div className="grid grid-cols-2 divide-x divide-[#e8eee6] px-3 py-7">
//                   {/* AVAILABLE COPIES */}
//                   <div className="flex min-h-[100px] flex-col justify-between px-4 sm:px-6">
//                     <p className="text-sm leading-5 text-[#819084]">
//                       Available copies
//                     </p>

//                     <div className="flex h-12 items-center">
//                       <span className="font-serif text-[36px] leading-none font-semibold text-[#1b3828]">
//                         {book.totalCopies}
//                       </span>
//                     </div>
//                   </div>

//                   {/* LOAN DURATION */}
//                   <div className="flex min-h-[100px] flex-col justify-between px-4 sm:px-6">
//                     <p className="text-sm leading-5 text-[#819084]">
//                       Loan duration
//                     </p>

//                     <div className="flex h-12 items-center gap-2.5">
//                       <Clock3 className="size-5 shrink-0 text-[#64826b]" />

//                       <span className="font-serif text-[30px] leading-none font-semibold text-[#1b3828] sm:text-[36px]">
//                         7 days
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ALREADY BORROWED */}
//                 {alreadyBorrowed && (
//                   <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-[#eaf2e8] px-4 py-3 text-sm text-[#1d513b]">
//                     <Check className="size-4 shrink-0" />
//                     You have already borrowed this book.
//                   </div>
//                 )}

//                 {/* ACTION BUTTONS */}
//                 <div className="space-y-3 border-t border-[#edf1eb] px-6 py-5">
//                   <Button
//                     size="lg"
//                     disabled={!available || alreadyBorrowed}
//                     onClick={() => setDialogOpen(true)}
//                     className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d513b] text-sm leading-none font-medium text-white hover:bg-[#153e2c] disabled:bg-[#d9e1d8] disabled:text-[#718474]"
//                   >
//                     <span>
//                       {!available
//                         ? "Not Available"
//                         : alreadyBorrowed
//                           ? "Already Borrowed"
//                           : "Borrow This Book"}
//                     </span>

//                     {available && !alreadyBorrowed && (
//                       <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
//                     )}
//                   </Button>

//                   <Link
//                     href="/my-borrows"
//                     className={cn(
//                       buttonVariants({ variant: "outline" }),
//                       "flex h-11 w-full items-center justify-center rounded-xl border-[#dce6dc] bg-white text-sm leading-none font-medium text-[#315b40] hover:bg-[#f1f7ee]",
//                     )}
//                   >
//                     View My Borrows
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* BORROW DIALOG */}
//       <BorrowBookDialog
//         book={book}
//         userName={userName}
//         userEmail={userEmail}
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         onBorrowed={handleRefresh}
//       />
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  RefreshCw,
  UserRound,
  Bookmark,
} from "lucide-react";

import type { IBook } from "@/types/book";
import BorrowBookDialog from "./BorrowBookDialog";

import { apiFetch } from "@/lib/api-client";
import { checkBorrowStatus } from "@/lib/book-api";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BookDetailsProps {
  bookId: string;
  userName: string;
  userEmail: string;
}

export default function BookDetails({
  bookId,
  userName,
  userEmail,
}: BookDetailsProps) {
  const [book, setBook] = useState<IBook | null>(null);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // FETCH BOOK DETAILS AND BORROW STATUS
  useEffect(() => {
    const controller = new AbortController();

    const fetchBookDetails = async () => {
      try {
        // STEP 1: FETCH PROTECTED BOOK DETAILS
        const response = await apiFetch(
          `/books/${encodeURIComponent(bookId)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message || "Failed to fetch book details",
          );
        }

        const bookData: IBook | null = await response.json();

        if (!bookData?._id) {
          throw new Error("Book not found");
        }

        // STEP 2: CHECK AUTHENTICATED USER'S BORROW STATUS
        const borrowData = await checkBorrowStatus(bookId);

        // STEP 3: UPDATE COMPONENT STATE
        if (!controller.signal.aborted) {
          setBook(bookData);
          setAlreadyBorrowed(Boolean(borrowData.alreadyBorrowed));
          setError("");
          setLoading(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Book details error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch book details",
        );

        setLoading(false);
      }
    };

    void fetchBookDetails();

    return () => controller.abort();
  }, [bookId, userEmail, refreshKey]);

  // REFRESH BOOK DETAILS AFTER BORROWING
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf6]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mb-10 h-5 w-36" />

          <div className="grid gap-10 lg:grid-cols-2">
            <Skeleton className="min-h-[650px] rounded-3xl" />

            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ERROR STATE
  if (error || !book) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf6] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#dce6dc] bg-white px-8 py-14 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#eaf2e8]">
            <BookOpen className="size-8 text-[#1d513b]" />
          </div>

          <h2 className="font-serif text-3xl font-semibold text-[#1b3828]">
            Book unavailable
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error || "Book not found"}
          </p>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="mt-6"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  const available = book.totalCopies > 0;

  return (
    <main className="min-h-screen bg-[#f8faf6]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* BACK LINK */}
        <Link
          href="/books"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#708474] transition-colors hover:text-[#1d513b]"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to all books
        </Link>

        {/* MAIN GRID */}
        <div className="mt-8 grid min-w-0 items-stretch gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          {/* LEFT SIDE */}
          <section className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#dce6dc] bg-[#e8f0e6] p-6 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full border border-[#d2e2d1]" />

            <div className="pointer-events-none absolute -bottom-32 -left-28 size-80 rounded-full border border-[#d2e2d1]" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold tracking-[0.22em] text-[#607b67] uppercase">
                BookNook Collection
              </span>

              <Bookmark className="size-5 text-[#688a71]" />
            </div>

            <div className="relative z-10 flex flex-1 items-center justify-center py-12 lg:py-16">
              <div className="relative aspect-[2/3] w-full max-w-[360px] overflow-hidden rounded-r-xl rounded-l-sm bg-white shadow-[18px_24px_45px_rgba(29,81,59,0.20)]">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={`${book.title} cover`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 80vw, 360px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="size-16 text-[#8aa18e]" />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-linear-to-r from-black/15 to-transparent" />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#9cb4a0]" />

              <p className="text-center text-[11px] font-medium tracking-[0.2em] text-[#718a76] uppercase">
                Every book has a story
              </p>

              <span className="h-px w-8 bg-[#9cb4a0]" />
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="flex h-full min-w-0 flex-col">
            {/* BOOK HEADER */}
            <div>
              <Badge className="border-0 bg-[#e4eee1] px-3 py-1 text-xs font-medium text-[#1d513b]">
                {book.category}
              </Badge>

              <h1 className="mt-5 font-serif text-4xl leading-[1.12] font-bold tracking-tight text-[#1b3828] sm:text-5xl lg:text-[54px]">
                {book.title}
              </h1>

              <p className="mt-4 text-base text-[#7a8d7d] sm:text-lg">
                by{" "}
                <span className="font-medium text-[#31503b]">
                  {book.author}
                </span>
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 border-t border-[#dce6dc] pt-7">
              <h2 className="font-serif text-2xl font-semibold text-[#1b3828]">
                About this book
              </h2>

              <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#617466]">
                {book.description}
              </p>
            </div>

            {/* BOTTOM SECTION */}
            <div className="mt-auto pt-9">
              {/* SHARED BY */}
              <div className="flex items-center gap-4 border-t border-[#dce6dc] py-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e5efe3]">
                  <UserRound className="size-5 text-[#1d513b]" />
                </div>

                <div className="flex min-w-0 flex-col justify-center gap-1">
                  <p className="text-xs leading-5 font-medium text-[#819084]">
                    Shared by
                  </p>

                  <p className="text-base leading-6 font-semibold text-[#1b3828]">
                    {book.userName}
                  </p>

                  <p className="break-all text-sm leading-5 text-[#819084]">
                    {book.userEmail}
                  </p>
                </div>
              </div>

              {/* AVAILABILITY CARD */}
              <div className="overflow-hidden rounded-2xl border border-[#dce6dc] bg-white shadow-sm">
                {/* CARD HEADER */}
                <div className="flex min-h-[88px] flex-wrap items-center justify-between gap-4 border-b border-[#e8eee6] px-6 py-5">
                  <h3 className="font-serif text-xl leading-7 font-semibold text-[#1b3828]">
                    Book availability
                  </h3>

                  <span
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-xs leading-none font-medium",
                      available
                        ? "bg-[#e8f5e9] text-[#287447]"
                        : "bg-[#fff0f0] text-[#b44747]",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        available
                          ? "bg-[#36a36b]"
                          : "bg-[#d55c5c]",
                      )}
                    />

                    {available ? "Available" : "Not Available"}
                  </span>
                </div>

                {/* INFORMATION GRID */}
                <div className="grid grid-cols-2 divide-x divide-[#e8eee6] px-3 py-7">
                  {/* AVAILABLE COPIES */}
                  <div className="flex min-h-[100px] flex-col justify-between px-4 sm:px-6">
                    <p className="text-sm leading-5 text-[#819084]">
                      Available copies
                    </p>

                    <div className="flex h-12 items-center">
                      <span className="font-serif text-[36px] leading-none font-semibold text-[#1b3828]">
                        {book.totalCopies}
                      </span>
                    </div>
                  </div>

                  {/* LOAN DURATION */}
                  <div className="flex min-h-[100px] flex-col justify-between px-4 sm:px-6">
                    <p className="text-sm leading-5 text-[#819084]">
                      Loan duration
                    </p>

                    <div className="flex h-12 items-center gap-2.5">
                      <Clock3 className="size-5 shrink-0 text-[#64826b]" />

                      <span className="font-serif text-[30px] leading-none font-semibold text-[#1b3828] sm:text-[36px]">
                        7 days
                      </span>
                    </div>
                  </div>
                </div>

                {/* ALREADY BORROWED */}
                {alreadyBorrowed && (
                  <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-[#eaf2e8] px-4 py-3 text-sm text-[#1d513b]">
                    <Check className="size-4 shrink-0" />
                    You have already borrowed this book.
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="space-y-3 border-t border-[#edf1eb] px-6 py-5">
                  <Button
                    size="lg"
                    disabled={!available || alreadyBorrowed}
                    onClick={() => setDialogOpen(true)}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d513b] text-sm leading-none font-medium text-white hover:bg-[#153e2c] disabled:bg-[#d9e1d8] disabled:text-[#718474]"
                  >
                    <span>
                      {!available
                        ? "Not Available"
                        : alreadyBorrowed
                          ? "Already Borrowed"
                          : "Borrow This Book"}
                    </span>

                    {available && !alreadyBorrowed && (
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>

                  <Link
                    href="/my-borrows"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex h-11 w-full items-center justify-center rounded-xl border-[#dce6dc] bg-white text-sm leading-none font-medium text-[#315b40] hover:bg-[#f1f7ee]",
                    )}
                  >
                    View My Borrows
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* BORROW DIALOG */}
      <BorrowBookDialog
        book={book}
        userName={userName}
        userEmail={userEmail}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onBorrowed={handleRefresh}
      />
    </main>
  );
}
