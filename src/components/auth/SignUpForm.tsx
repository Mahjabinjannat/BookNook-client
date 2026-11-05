"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";
import ProfilePhotoCropper from "@/components/auth/ProfilePhotoCropper";

type FormErrors = Partial<Record<keyof SignUpFormValues, string>>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SignUpForm() {
  const router = useRouter();

  // FORM STATES
  const [form, setForm] = useState<SignUpFormValues>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // PROFILE PHOTO STATES
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [photoError, setPhotoError] = useState("");

  // HANDLE FORM INPUT CHANGES
  const handleChange = (field: keyof SignUpFormValues, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // HANDLE PHOTO SELECTION
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow selecting the same file again
    e.target.value = "";

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Please select a JPG, PNG or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError("Image must be smaller than 5 MB");
      return;
    }

    setPhotoError("");
    setOriginalFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setOriginalImage(reader.result);
      }
    };

    reader.onerror = () => {
      setPhotoError("Could not read the selected image");
      toast.error("Could not read the selected image");
    };

    reader.readAsDataURL(file);
  };

  // SAVE CROPPED PHOTO
  const handleCropSave = (file: File) => {
    setSelectedFile(file);
    setPhotoError("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };

    reader.onerror = () => {
      toast.error("Could not preview the cropped image");
    };

    reader.readAsDataURL(file);
    setOriginalImage(null);
  };

  // CANCEL CROPPING
  const handleCropCancel = () => {
    setOriginalImage(null);
  };

  // HANDLE EMAIL SIGNUP
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || googleLoading) return;

    // STEP 1: VALIDATE FORM
    const validation = signUpSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignUpFormValues;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      toast.error("Please correct the form errors");
      return;
    }

    setErrors({});

    // STEP 2: VALIDATE PROFILE PHOTO
    if (!selectedFile) {
      setPhotoError("Please choose and crop a profile photo");
      toast.error("Please choose and crop a profile photo");
      return;
    }

    setPhotoError("");
    setLoading(true);

    try {
      // STEP 3: UPLOAD CROPPED PHOTO TO IMGBB
      const uploadForm = new FormData();
      uploadForm.append("image", selectedFile);

      const uploadResponse = await fetch("/api/upload-profile", {
        method: "POST",
        body: uploadForm,
      });

      const uploadResult = await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        typeof uploadResult.url !== "string" ||
        !uploadResult.url
      ) {
        toast.error(uploadResult.error || "Photo upload failed");
        return;
      }

      const imageUrl: string = uploadResult.url;

      // STEP 4: REGISTER WITH BETTER AUTH
      const { error } = await authClient.signUp.email({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
        image: imageUrl,
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Registration failed");
        return;
      }

      // STEP 5: SUCCESS
      toast.success("Account created successfully! Please log in.");

      router.push("/signIn");
      router.refresh();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLE GOOGLE SIGNUP
  const handleGoogleSignUp = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed");
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
      toast.error("Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e1e5dc] bg-[#fcfcfa] px-4 py-3 text-sm text-[#1c3025] outline-none transition focus:border-[#1d513b] focus:ring-2 focus:ring-[#1d513b]/10";

  return (
    <>
      <div className="w-full max-w-[460px]">
        {/* HEADING */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d513b] text-white">
            <BookOpen size={24} />
          </div>

          <h1 className="font-heading text-4xl font-semibold text-[#19271f]">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-[#68746b]">
            Join our community of readers and book lovers.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-[#e8e6dc] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#24362b]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                className={inputClass}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#24362b]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={inputClass}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* SINGLE AVATAR FIELD */}
            <div>
              <label
                htmlFor="profilePhoto"
                className="mb-2 block text-sm font-medium text-[#24362b]"
              >
                Avatar
              </label>

              {/* CUSTOM FILE INPUT */}
              <div className="flex min-h-[64px] items-center gap-3 rounded-xl border border-[#d1d5db] bg-white px-3 py-2">
                <label
                  htmlFor="profilePhoto"
                  className="shrink-0 cursor-pointer rounded-lg border border-[#a8a8a8] bg-[#f1f1f1] px-4 py-2.5 text-sm font-medium text-[#24362b] transition hover:bg-[#e5e5e5]"
                >
                  Choose File
                </label>

                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  aria-invalid={!!photoError}
                  aria-label="Choose profile photo"
                  className="sr-only"
                />

                <span className="min-w-0 flex-1 truncate text-sm text-[#68746b]">
                  {selectedFile ? selectedFile.name : "No photo selected"}
                </span>

                {selectedFile && (
                  <CheckCircle2 size={18} className="shrink-0 text-[#1d513b]" />
                )}
              </div>

              <p className="mt-2 text-xs text-[#8b958c]">
                JPG, PNG or WebP. Maximum 5 MB. You can crop and reposition your
                photo.
              </p>

              {/* CROPPED PHOTO PREVIEW */}
              {preview && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e1e5dc] bg-[#f1f4ee]">
                    <Image
                      src={preview}
                      alt="Cropped profile photo"
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#1d513b]">
                      Profile photo ready
                    </p>

                    <p className="mt-1 text-xs text-[#68746b]">
                      Cropped and ready to upload.
                    </p>

                    <p className="mt-1 text-xs text-[#8b958c]">
                      Choose another image to change it.
                    </p>
                  </div>
                </div>
              )}

              {/* PHOTO VALIDATION ERROR */}
              {photoError && (
                <p className="mt-2 text-xs text-red-600">{photoError}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#24362b]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  aria-invalid={!!errors.password}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#778077] hover:text-[#1d513b]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}

              <div className="mt-3 space-y-1 text-xs text-[#778077]">
                <p>• At least 6 characters</p>
                <p>• At least one uppercase letter (A–Z)</p>
                <p>• At least one lowercase letter (a–z)</p>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d513b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#153e2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
                  d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.88 23.88 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6C30.01 37.65 27.25 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* LOGIN LINK */}
          <p className="mt-7 text-center text-sm text-[#68746b]">
            Already have an account?{" "}
            <Link
              href="/signIn"
              className="font-semibold text-[#1d513b] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* PROFILE PHOTO CROPPER MODAL */}
      {originalImage && (
        <ProfilePhotoCropper
          imageSrc={originalImage}
          fileName={originalFileName}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
