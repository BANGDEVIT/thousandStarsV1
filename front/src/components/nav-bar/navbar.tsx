import { NavigationMenu_1 } from "@/components/nav-bar/nav-list";
import { NavUser } from "@/components/profile/nav-user";

export default function Navbar() {
  return (
    <div className="bg-[#335F76] shadow-sm p-6 flex items-center w-full justify-between">
      
      <div className="flex-1 flex justify-start">
        <span className="text-white text-3xl font-bold font-['Lora']">
          <a href="/homePage">THOUSAND STARS</a>
        </span>
      </div>

      <div className="flex-none flex justify-center">
        <NavigationMenu_1 />
      </div>

      <div className="flex-1 flex justify-end">
        <NavUser />
      </div>

    </div>
  );
}