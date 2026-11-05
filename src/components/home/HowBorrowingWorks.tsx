
import {
  Search,
  BookOpenCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover a Book",
    description:
      "Browse our collection and find a story that catches your interest.",
  },
  {
    number: "02",
    icon: BookOpenCheck,
    title: "Borrow & Enjoy",
    description:
      "Choose an available book, confirm your borrow, and enjoy reading for 7 days.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Return & Repeat",
    description:
      "Return your book when you're finished and discover your next great read.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="w-full bg-[#eaf2e8] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#739078]">
            Simple & Thoughtful
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#1b3828] sm:text-4xl">
            How BookNook Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#718474] sm:text-base">
            Great stories deserve to be shared.
            Borrowing your next favorite book is just a few steps away.
          </p>
        </div>

        {/* STEPS */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#d4e2d3] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="absolute right-6 top-5 font-serif text-4xl font-bold text-[#e2ede1]">
                  {step.number}
                </span>

                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#eaf2e8]">
                  <Icon
                    className="size-7 text-[#1d513b]"
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#1b3828]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#718474]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/books"
            className={cn(
              buttonVariants(),
              "h-12 rounded-full bg-[#1d513b] px-8 text-white hover:bg-[#153e2c]"
            )}
          >
            Start Exploring
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
