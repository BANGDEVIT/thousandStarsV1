import Navbar from "@/components/features/nav-bar/navbar";
import { HeroSection } from "@/components/features/homepage/HeroSection";
import { FeaturedRoomsSection } from "@/components/features/homepage/FeaturedRoomsSection";
import { AmenitiesSection } from "@/components/features/homepage/AmenitiesSection";
import { TestimonialsSection } from "@/components/features/homepage/TestimonialsSection";
import { CtaSection } from "@/components/features/homepage/CtaSection";
import { FooterSection } from "@/components/features/homepage/FooterSection";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedRoomsSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
