import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | BookNook",
  description: "Sign In to explore, share and borrow books in the BookNook community.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#faf9f4] px-4 py-12">
      <Suspense
        fallback={<p className="text-sm text-[#68746b]">Loading sign in...</p>}
      >
        <SignInForm />
      </Suspense>
    </main>
  );
}
