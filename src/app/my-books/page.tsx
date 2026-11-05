import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import MyBooksTable from "@/components/books/MyBooksTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Books | BookNook",
  description: "Explore books shared by you.",
};

export default async function MyBooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signIn?callbackUrl=/my-books");
  }

  return (
    <main className="min-h-screen w-full min-w-0 bg-[#f8faf6]">
      {/* PAGE HEADER */}
      <section className="w-full border-b border-[#dce6dc] bg-[#eaf2e8] px-4 py-12 text-center sm:py-16">
        <h1 className="font-serif text-4xl font-bold text-[#1b3828] sm:text-5xl">
          My Books
        </h1>

        <p className="mt-3 text-sm text-[#687b6b] sm:text-base">
          Books you added to the library.
        </p>
      </section>

      {/* MY BOOKS TABLE */}
      <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-10 sm:px-6 sm:py-14">
        <MyBooksTable userEmail={session.user.email} />
      </section>
    </main>
  );
}
