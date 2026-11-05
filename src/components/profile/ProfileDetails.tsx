import Link from "next/link";
import {
  ArrowRight,
  BookHeart,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  LibraryBig,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface ProfileDetailsProps {
  user: ProfileUser;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const firstName = user.name.trim().split(/\s+/)[0] || "Reader";

  const profileFields = [
    {
      label: "Full Name",
      value: user.name,
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      icon: CalendarDays,
    },
  ];

  const quickLinks = [
    {
      title: "Explore Books",
      description: "Find your next favorite read.",
      href: "/books",
      icon: LibraryBig,
    },
    {
      title: "My Books",
      description: "Manage the books you've added.",
      href: "/my-books",
      icon: BookOpen,
    },
    {
      title: "My Borrows",
      description: "View and return borrowed books.",
      href: "/my-borrows",
      icon: BookHeart,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid items-start gap-7 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* LEFT SIDE - PROFILE CARD */}
        <Card className="overflow-hidden rounded-3xl border-[#e0e8df] bg-white py-0 shadow-sm">
          <div className="relative h-28 bg-gradient-to-r from-[#1b513b] via-[#397357] to-[#8cae8e]">
            <div className="absolute right-6 top-5 opacity-20">
              <BookOpen className="size-20 text-white" />
            </div>
          </div>

          <CardContent className="relative px-6 pb-8 pt-0 text-center">
            <div className="-mt-12 flex justify-center">
              <Avatar className="size-24 border-4 border-white bg-[#eaf2e8] shadow-md">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#eaf2e8] text-2xl font-bold text-[#1d513b]">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-5">
              <h2 className="break-words text-2xl font-bold text-[#1b3828]">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-[#748477]">
                {user.email}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Badge className="rounded-full border-0 bg-[#eaf2e8] px-3 py-1 text-[#1d513b]">
                <BookOpen className="mr-1 size-3.5" />
                BookNook Member
              </Badge>

              {user.emailVerified && (
                <Badge className="rounded-full border-0 bg-[#edf7ed] px-3 py-1 text-[#287047]">
                  <CheckCircle2 className="mr-1 size-3.5" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="mt-7 border-t border-[#edf1eb] pt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-[#6a7d70]">
                <CalendarDays className="size-4 text-[#a67c43]" />
                Member since {formatDate(user.createdAt)}
              </div>
            </div>

            <div className="mt-7">
              <Button
                nativeButton={false}
                render={<Link href="/books" />}
                className="h-11 w-full rounded-xl bg-[#1d513b] text-white hover:bg-[#153e2c]"
              >
                Explore Library
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
        <div className="min-w-0 space-y-7">
          {/* WELCOME CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1b3828] p-7 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-5 top-5 size-36 rounded-full border border-white/10" />

            <div className="relative z-10">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles className="size-5 text-[#e4c58b]" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e4c58b]">
                Welcome Back
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Hello, {firstName}!
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#d1dfd3]">
                Every great story begins with a single page. Your next reading
                adventure is waiting for you at BookNook.
              </p>

              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e4c58b] transition hover:gap-3"
              >
                Discover New Books
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* ACCOUNT INFORMATION */}
          <Card className="rounded-3xl border-[#e0e8df] bg-white shadow-sm">
            <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#eaf2e8]">
                  <CircleUserRound className="size-5 text-[#1d513b]" />
                </div>

                <div>
                  <CardTitle className="text-xl font-bold text-[#1b3828]">
                    Personal Information
                  </CardTitle>
                  <p className="mt-1 text-sm text-[#7b897e]">
                    Your BookNook account details
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-7 sm:px-8">
              {profileFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.label}
                    className="flex items-start gap-4 rounded-2xl border border-[#edf1eb] bg-[#fbfcfa] p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf2e8]">
                      <Icon className="size-4.5 text-[#1d513b]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#829084]">
                        {field.label}
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-[#263e2e] sm:text-base">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ACCOUNT STATUS */}
          <Card className="rounded-3xl border-[#e0e8df] bg-white shadow-sm">
            <CardContent className="flex items-start gap-4 p-6 sm:p-7">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf2e8]">
                <ShieldCheck className="size-6 text-[#1d513b]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#1b3828]">
                  Account Status
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#6b7b6f]">
                  Your account is active and you are signed in to BookNook.
                </p>

                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#bcd6c3] bg-[#f0f8f1] text-[#287047]"
                  >
                    <CheckCircle2 className="mr-1 size-3.5" />
                    Active Account
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <section className="mt-12 sm:mt-16">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a67c43]">
            Your Library Space
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#1b3828] sm:text-3xl">
            Quick Access
          </h2>

          <p className="mt-2 text-sm text-[#748477]">
            Everything you need for your reading journey.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-[#e0e8df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#a8c5af] hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf2e8] transition-colors group-hover:bg-[#1d513b]">
                  <Icon className="size-5 text-[#1d513b] transition-colors group-hover:text-white" />
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#1b3828]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#78877b]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 size-4 shrink-0 text-[#8b9d8e] transition-transform group-hover:translate-x-1 group-hover:text-[#1d513b]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
