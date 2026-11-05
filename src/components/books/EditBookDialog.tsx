"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

import type { IBook } from "@/types/book";
import { addBookSchema, bookCategories } from "@/lib/validations/book";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditableBook = Pick<
  IBook,
  "title" | "author" | "category" | "totalCopies" | "description"
>;

type FormField = keyof EditableBook;
type FormErrors = Partial<Record<FormField, string>>;

interface EditBookDialogProps {
  book: IBook;
  onClose: () => void;
  onUpdated: () => void;
}

const editSchema = addBookSchema.omit({
  image: true,
});

const inputStyle =
  "!h-11 w-full rounded-xl border-[#dce5da] bg-[#fcfdfa] px-4 shadow-none focus-visible:border-[#1d513b] focus-visible:ring-[#1d513b]/15";

export default function EditBookDialog({
  book,
  onClose,
  onUpdated,
}: EditBookDialogProps) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    category: book.category as string,
    totalCopies: String(book.totalCopies),
    description: book.description,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    const validation = editSchema.safeParse({
      ...form,
      totalCopies:
        form.totalCopies.trim() === "" ? 0 : Number(form.totalCopies),
    });

    if (!validation.success) {
      const nextErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0] as FormField;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      toast.error("Please correct the form errors");
      return;
    }

    const validated = validation.data;

    // SEND ONLY CHANGED FIELDS
    const updatedFields: Partial<EditableBook> = {};

    if (validated.title !== book.title) {
      updatedFields.title = validated.title;
    }

    if (validated.author !== book.author) {
      updatedFields.author = validated.author;
    }

    if (validated.category !== book.category) {
      updatedFields.category = validated.category;
    }

    if (validated.totalCopies !== book.totalCopies) {
      updatedFields.totalCopies = validated.totalCopies;
    }

    if (validated.description !== book.description) {
      updatedFields.description = validated.description;
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    setSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("Backend API URL is missing");
      }

      const response = await apiFetch(`/my-books/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update book");
      }

      toast.success("Book updated successfully");
      onClose();
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-[#dce5da] bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl text-[#1b3828]">
            <Pencil className="size-5" />
            Edit Book
          </DialogTitle>

          <DialogDescription>
            Update only the information you want to change.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Book Title</Label>

            <Input
              id="edit-title"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className={inputStyle}
            />

            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* AUTHOR */}
          <div className="space-y-2">
            <Label htmlFor="edit-author">Author Name</Label>

            <Input
              id="edit-author"
              value={form.author}
              onChange={(event) => handleChange("author", event.target.value)}
              className={inputStyle}
            />

            {errors.author && (
              <p className="text-xs text-red-600">{errors.author}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* CATEGORY */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>

              <Select
                value={form.category}
                onValueChange={(value) => handleChange("category", value ?? "")}
              >
                <SelectTrigger id="edit-category" className={inputStyle}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {bookCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            {/* TOTAL COPIES */}
            <div className="space-y-2">
              <Label htmlFor="edit-copies">Total Copies</Label>

              <Input
                id="edit-copies"
                type="number"
                min={1}
                step={1}
                value={form.totalCopies}
                onChange={(event) =>
                  handleChange("totalCopies", event.target.value)
                }
                className={inputStyle}
              />

              {errors.totalCopies && (
                <p className="text-xs text-red-600">{errors.totalCopies}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Short Description</Label>

            <Textarea
              id="edit-description"
              rows={5}
              maxLength={2000}
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              className="min-h-28 rounded-xl border-[#dce5da] bg-[#fcfdfa] shadow-none focus-visible:border-[#1d513b] focus-visible:ring-[#1d513b]/15"
            />

            {errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="bg-[#1d513b] text-white hover:bg-[#153e2c]"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
