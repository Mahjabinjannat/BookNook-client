"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    image: "/assets/slider1.jpg",
    eyebrow: "WELCOME TO BOOKNOOK",
    title: "Every great story begins with a book.",
    description:
      "Explore a world of stories, knowledge, and imagination. Your next favourite read is waiting on our shelves.",
    button: "Explore Collection",
    href: "/books",
  },
  {
    id: 2,
    image: "/assets/slider2.jpg",
    eyebrow: "READ • DISCOVER • REPEAT",
    title: "Find your next unforgettable read.",
    description:
      "From timeless classics to modern discoveries, find the books that inspire your next adventure.",
    button: "Browse Books",
    href: "/books",
  },
  {
    id: 3,
    image: "/assets/slider3.jpeg",
    eyebrow: "SHARE THE LOVE OF READING",
    title: "Good books deserve to be shared.",
    description:
      "Give your favourite books a new home. Share stories with fellow readers and grow our community library.",
    button: "Share a Book",
    href: "/add-book",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        speed={900}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        className="booknook-hero"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex min-h-[560px] items-center overflow-hidden md:min-h-[650px] lg:min-h-[720px]">
              {/* BACKGROUND IMAGE */}
              <Image
                src={slide.image}
                alt="Beautiful library and books"
                fill
                priority={slide.id === 1}
                sizes="100vw"
                className="object-cover"
              />

              {/* CINEMATIC OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07150e]/90 via-[#07150e]/65 to-[#07150e]/20" />

              {/* CONTENT */}
              <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-24 md:px-12 lg:px-20">
                <div className="max-w-[680px]">
                  <div className="mb-7 flex items-center gap-3">
                    <span className="h-px w-9 bg-[#d4a34f]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e6bd78]">
                      {slide.eyebrow}
                    </span>
                  </div>

                  <h1 className="font-heading text-[44px] font-semibold leading-[1.12] tracking-tight text-white sm:text-[56px] lg:text-[72px]">
                    {slide.title}
                  </h1>

                  <p className="mt-7 max-w-[540px] text-base leading-relaxed text-white/80 md:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.href}
                    className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#d9e9cf] px-7 py-3.5 text-sm font-semibold text-[#173c2b] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    {slide.button}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* CUSTOM NAVIGATION */}
        <button
          type="button"
          aria-label="Previous slide"
          className="hero-prev absolute bottom-10 right-24 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/20"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          aria-label="Next slide"
          className="hero-next absolute bottom-10 right-10 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/20"
        >
          <ArrowRight size={18} />
        </button>
      </Swiper>
    </section>
  );
}
