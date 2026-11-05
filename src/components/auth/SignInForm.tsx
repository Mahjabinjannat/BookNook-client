"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  BookOpen,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";

type FormErrors = Partial<Record<keyof SignInFormValues, string>>;

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedRedirect = searchParams.get("redirect");

  // Only allow internal redirects.
  const redirectTo =
    requestedRedirect?.startsWith("/") &&
    !requestedRedirect.startsWith("//") &&
    !requestedRedirect.startsWith("/\\")
      ? requestedRedirect
      : "/";

  const [form, setForm] = useState<SignInFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (field: keyof SignInFormValues, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = signInSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignInFormValues;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      toast.error("Please correct the form errors");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back! You are now signed in.");

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed");
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      toast.error("Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e1e5dc] bg-[#fcfcfa] px-4 py-3 text-sm text-[#1c3025] outline-none transition focus:border-[#1d513b] focus:ring-2 focus:ring-[#1d513b]/10";

  return (
    <div className="w-full max-w-[460px]">
      {/* HEADING */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d513b] text-white">
          <BookOpen size={24} />
        </div>

        <h1 className="font-heading text-4xl font-semibold text-[#19271f]">
          Welcome back
        </h1>

        <p className="mt-3 text-sm text-[#68746b]">
          Sign in to continue your reading journey.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="rounded-2xl border border-[#e8e6dc] bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#24362b]"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b958c]"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={`${inputClass} pl-11`}
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#24362b]"
              >
                Password
              </label>

              {/* UI ONLY - per assignment */}
              <button
                type="button"
                onClick={() =>
                  toast.info("Password recovery is not available yet.")
                }
                className="text-xs font-semibold text-[#1d513b] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b958c]"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                aria-invalid={!!errors.password}
                className={`${inputClass} pl-11 pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#778077] hover:text-[#1d513b]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d513b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#153e2c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#e8e6dc]" />
          <span className="text-xs text-[#8b958c]">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-[#e8e6dc]" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e1e5dc] bg-white px-6 py-3.5 text-sm font-medium text-[#24362b] transition hover:bg-[#f7f8f4] disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.3 5.48-4.88 7.18l7.73 6C44.3 38.03 46.98 31.88 46.98 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.88 23.88 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97 6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6C30.01 37.65 27.25 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        {/* REGISTER LINK */}
        <p className="mt-7 text-center text-sm text-[#68746b]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signUp"
            className="font-semibold text-[#1d513b] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
