import ExploreCategories from "@/components/home/ExploreCategories";
import HeroSlider from "@/components/home/heroSlider";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";
import NewArrivals from "@/components/home/NewArrival";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook",
  description: "Explore, share and borrow books in the BookNook community.",
};

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <NewArrivals />
      <HowBorrowingWorks />
      <ExploreCategories />
    </div>
  );
}
