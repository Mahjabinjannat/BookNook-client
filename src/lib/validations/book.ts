
import { z } from "zod";

export const bookCategories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export const addBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Book title must be at least 2 characters"),

  author: z
    .string()
    .trim()
    .min(2, "Author name must be at least 2 characters"),

  category: z.enum(bookCategories, {
    error: "Please select a category",
  }),

  totalCopies: z
    .number()
    .int("Total copies must be a whole number")
    .min(1, "Total copies must be at least 1"),

  image: z.url("Please upload a valid book image"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export type AddBookValues = z.infer<typeof addBookSchema>;
