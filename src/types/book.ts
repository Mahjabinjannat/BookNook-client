export interface IBook {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  totalCopies: number;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
  createdAt?: string;
  updatedAt?: string;
}
