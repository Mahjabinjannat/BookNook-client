import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import ProfileDetails from "@/components/profile/ProfileDetails";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
  description: "View your BookNook account and profile information.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signIn?callbackUrl=/profile");
  }

  const user = session.user;

  return (
    <main className="min-h-screen w-full bg-[#f8faf6]">
      <section className="border-b border-[#dce6dc] bg-[#eaf2e8]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#a67c43]">
            Your Reading Corner
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#1b3828] sm:text-4xl lg:text-5xl">
            My Profile
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#627568] sm:text-base">
            Your personal space at BookNook. View your account details and find
            your way back to the books you love.
          </p>
        </div>
      </section>

      <ProfileDetails
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </main>
  );
}
