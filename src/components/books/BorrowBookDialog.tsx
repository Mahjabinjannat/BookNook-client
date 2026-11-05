"use client";

import { useState } from "react";
import { CalendarDays, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

import type { IBook } from "@/types/book";
import { borrowBook } from "@/lib/book-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BorrowBookDialogProps {
  book: IBook;
  userName: string;
  userEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBorrowed: () => void;
}

export default function BorrowBookDialog({
  book,
  userName,
  userEmail,
  open,
  onOpenChange,
  onBorrowed,
}: BorrowBookDialogProps) {
  const [borrowing, setBorrowing] = useState(false);

  // HANDLE BORROW BOOK
  const handleBorrow = async () => {
    // Prevent duplicate requests
    if (borrowing) return;

    // Validate book ID
    if (!book?._id) {
      toast.error("Invalid book information");
      return;
    }

    // Check book availability
    if (book.totalCopies <= 0) {
      toast.error("This book is currently unavailable");
      return;
    }

    setBorrowing(true);

    try {
      // Authenticated request using apiFetch() internally.
      // The backend gets userEmail and userName
      // from the verified JWT, not from the request body.
      const result = await borrowBook(book._id);

      // Show success notification
      toast.success(result.message || "Book borrowed successfully!");

      // Close dialog
      onOpenChange(false);

      // Refresh book details and borrowing status
      onBorrowed();
    } catch (error) {
      console.error("Borrow book error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to borrow book. Please try again.",
      );
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!borrowing) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-[#dce6dc] bg-[#fffefa] sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#eaf2e8]">
            <BookOpen className="size-6 text-[#1d513b]" />
          </div>

          <DialogTitle className="font-serif text-2xl text-[#1b3828]">
            Borrow This Book
          </DialogTitle>

          <DialogDescription>
            You are about to borrow{" "}
            <span className="font-semibold text-[#1d513b]">{book.title}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* BORROWING PERIOD */}
        <div className="rounded-xl border border-[#dce6dc] bg-[#f2f7ef] p-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-5 shrink-0 text-[#1d513b]" />

            <div>
              <p className="text-sm font-semibold text-[#1b3828]">
                7-day borrowing period
              </p>

              <p className="mt-1 text-xs leading-5 text-[#687b6b]">
                Your return date will be 7 days after borrowing. You can return
                the book earlier.
              </p>
            </div>
          </div>
        </div>

        {/* USER INFORMATION */}
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="borrow-user-name">Your Name</Label>

            <Input
              id="borrow-user-name"
              value={userName}
              readOnly
              className="h-11 border-[#dce6dc] bg-[#f6f8f4] text-[#31503b]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-user-email">Your Email</Label>

            <Input
              id="borrow-user-email"
              type="email"
              value={userEmail}
              readOnly
              className="h-11 border-[#dce6dc] bg-[#f6f8f4] text-[#31503b]"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={borrowing}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={borrowing || book.totalCopies <= 0}
            onClick={handleBorrow}
            className="bg-[#1d513b] text-white hover:bg-[#153e2c]"
          >
            {borrowing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Borrowing...
              </>
            ) : (
              "Confirm Borrow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
