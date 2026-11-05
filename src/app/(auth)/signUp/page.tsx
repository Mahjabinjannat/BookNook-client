import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your BookNook account",
};

export default function signUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f7f4ec] px-4 py-16">
      <SignUpForm />
    </main>
  );
}
