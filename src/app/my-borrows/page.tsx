
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import MyBorrowsTable from "@/components/books/MyBorrowsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Borrows | BookNook",
  description: "Explore books borrowed by yourself.",
};

export default async function MyBorrowsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signIn");
  }

  return (
    <main className="min-h-screen w-full min-w-0 bg-[#f8faf6]">
      <section className="border-b border-[#dce6dc] bg-[#eaf2e8] px-4 py-12 text-center sm:py-16">
        <h1 className="font-serif text-4xl font-bold text-[#1b3828] sm:text-5xl">
          My Borrows
        </h1>

        <p className="mt-3 text-sm text-[#687b6b] sm:text-base">
          Keep track of your borrowed books and return dates.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-10 sm:px-6 sm:py-14">
        <MyBorrowsTable userEmail={session.user.email} />
      </section>
    </main>
  );
}
