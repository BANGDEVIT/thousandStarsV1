import { useEffect } from "react";
import Navbar from "@/components/features/nav-bar/navbar";
import { FooterSection } from "@/components/features/homepage/FooterSection";
import { HotelFeaturedRoomsSection } from "@/components/features/homepage/HotelFeaturedRoomsSection";
import { HotelSearchHeroSection } from "@/components/features/homepage/HotelSearchHeroSection";
import { useHomepageStore } from "@/stores/homepage.store";

const HomePage = () => {
  const { featuredRooms, loading, fetchFeaturedRooms } = useHomepageStore();

  useEffect(() => {
    fetchFeaturedRooms();
  }, [fetchFeaturedRooms]);

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <HotelSearchHeroSection rooms={featuredRooms} />
        <HotelFeaturedRoomsSection loading={loading} rooms={featuredRooms} />
      </main>
      <FooterSection />
    </div>
  );
};

export default HomePage;
