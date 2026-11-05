export interface IBorrow {
  _id: string;

  bookId: string;
  bookTitle: string;
  bookImage: string;

  title: string;
  image: string;
  author: string;

  userName: string;
  userEmail: string;

  borrowDate: string;
  returnDate: string;

  status: "borrowed" | "returned";

  returnedAt?: string;
}
