import { NavigationMenu_1 } from "@/components/nav-bar/nav-list";
import { NavUser } from "@/components/profile/nav-user";

export default function Navbar() {
  return (
    // 1. Thêm 'flex-wrap' và 'gap-y-4' để khi rớt hàng không bị dính vào nhau
    <div className="bg-[#335F76] shadow-sm p-6 flex flex-wrap items-center w-full justify-between gap-y-4">
      
      {/* 2. LOGO: Trên mobile/tablet chiếm 50% hàng trên, lên md mới trả về flex-1 */}
      <div className="w-1/2 md:flex-1 flex justify-start order-1">
        <span className="text-white text-3xl font-bold font-['Lora']">
          <a href="/homePage">THOUSAND STARS</a>
        </span>
      </div>

      {/* 4. MENU: Mặc định chiếm full 100% (bắt buộc rớt xuống hàng dưới), lên md mới trở lại ban đầu */}
      <div className="w-full md:w-auto md:flex-none flex justify-center order-3 md:order-2">
        <NavigationMenu_1 />
      </div>

      {/* 3. USER AVATAR: Chiếm 50% còn lại của hàng trên, lên md trả về flex-1 */}
      <div className="w-1/2 md:flex-1 flex justify-end order-2 md:order-3">
        <NavUser />
      </div>

    </div>
  );
}