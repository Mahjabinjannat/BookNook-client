
import { apiFetch } from "@/lib/api-client";
import type { IBook } from "@/types/book";

type ApiResult = {
  success: boolean;
  message?: string;
};

type AddBookInput = {
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  image: string;
  description: string;
};

type UpdateBookInput = Partial<
  Pick<
    IBook,
    "title" | "author" | "category" | "totalCopies" | "description"
  >
>;

export type BorrowRecord = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
  title?: string;
  image?: string;
  author?: string;
  returnedAt?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Request failed: ${response.status}`,
    );
  }

  return result as T;
}

// ADD BOOK
export async function addBook(bookData: AddBookInput) {
  const response = await apiFetch("/add-book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });

  return parseResponse<
    ApiResult & { insertedId: string }
  >(response);
}

// GET MY BOOKS
export async function getMyBooks(signal?: AbortSignal) {
  const response = await apiFetch("/my-books", {
    method: "GET",
    cache: "no-store",
    signal,
  });

  return parseResponse<
    ApiResult & { books: IBook[] }
  >(response);
}

// UPDATE MY BOOK
export async function updateMyBook(
  bookId: string,
  updatedFields: UpdateBookInput,
) {
  const response = await apiFetch(
    `/my-books/${encodeURIComponent(bookId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    },
  );

  return parseResponse<ApiResult>(response);
}

// DELETE MY BOOK
export async function deleteMyBook(bookId: string) {
  const response = await apiFetch(
    `/my-books/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<
    ApiResult & { deletedCount: number }
  >(response);
}

// BORROW BOOK
export async function borrowBook(bookId: string) {
  const response = await apiFetch("/borrows", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId }),
  });

  return parseResponse<
    ApiResult & { insertedId: string }
  >(response);
}

// CHECK BORROW STATUS
export async function checkBorrowStatus(bookId: string) {
  const response = await apiFetch(
    `/borrows/check?bookId=${encodeURIComponent(bookId)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return parseResponse<
    ApiResult & { alreadyBorrowed: boolean }
  >(response);
}

// GET MY BORROWED BOOKS
export async function getMyBorrows(signal?: AbortSignal) {
  const response = await apiFetch("/borrows", {
    method: "GET",
    cache: "no-store",
    signal,
  });

  return parseResponse<
    ApiResult & { borrows: BorrowRecord[] }
  >(response);
}

// RETURN BORROWED BOOK
export async function returnBorrowedBook(borrowId: string) {
  const response = await apiFetch(
    `/borrows/${encodeURIComponent(borrowId)}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<ApiResult>(response);
}
