import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import BookDetails from "@/components/books/BookDetails";
import { Metadata } from "next";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Book Details | BookNook",
  description: "Explore information of your desired book",
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  // Verify the actual Better Auth session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect("/signIn");
  }

  const { id } = await params;

  return (
    <BookDetails
      bookId={id}
      userName={session.user.name || ""}
      userEmail={session.user.email}
    />
  );
}
