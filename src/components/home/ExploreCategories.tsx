
import Link from "next/link";

import {
  BookHeart,
  FlaskConical,
  Landmark,
  Baby,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that take you beyond the ordinary.",
    icon: BookHeart,
    color: "bg-[#e9eee3]",
  },
  {
    name: "Science",
    description: "Discover ideas that change how we see the world.",
    icon: FlaskConical,
    color: "bg-[#e5efed]",
  },
  {
    name: "History",
    description: "Explore the people and events of the past.",
    icon: Landmark,
    color: "bg-[#f1ece3]",
  },
  {
    name: "Kids",
    description: "Little stories for curious young minds.",
    icon: Baby,
    color: "bg-[#f1e9eb]",
  },
  {
    name: "Others",
    description: "Unexpected discoveries for every reader.",
    icon: BookOpen,
    color: "bg-[#e9eaf1]",
  },
];

export default function ExploreCategories() {
  return (
    <section className="w-full bg-[#f8faf6] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#739078]">
            Something for Every Reader
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#1b3828] sm:text-4xl">
            Find Your Next Story
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#718474] sm:text-base">
            Whether you love imaginative worlds or fascinating facts,
            there&apos;s always something new to explore.
          </p>
        </div>

        {/* CATEGORY CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="group flex items-start gap-5 rounded-2xl border border-[#dce6dc] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b9d0bd] hover:shadow-md"
              >
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${category.color}`}
                >
                  <Icon
                    className="size-6 text-[#1d513b]"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-xl font-semibold text-[#1b3828]">
                      {category.name}
                    </h3>

                    <ArrowUpRight className="size-5 text-[#829b86] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#718474]">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
