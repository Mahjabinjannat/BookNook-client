import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddBookForm from "@/components/books/AddBookForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Book | BookNook",
  description: "Add books to contribute BookNook community.",
};

export default async function AddBookPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signIn");
  }

  return (
    <main className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-[#f8faf6]">
      <section className="border-b border-[#e3eae0] bg-[#eaf2e8] px-4 py-12 text-center sm:py-16">
        <h1 className="font-serif text-4xl font-bold text-[#1b3828] sm:text-5xl">
          Add a Book
        </h1>

        <p className="mt-3 text-sm text-[#687b6b] sm:text-base">
          Put a book from your shelf into the library.
        </p>
      </section>

      <section className="w-full min-w-0 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          <AddBookForm
            userName={session.user.name}
            userEmail={session.user.email}
          />
        </div>
      </section>
    </main>
  );
}
