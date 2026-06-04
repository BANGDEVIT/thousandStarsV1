import { Link } from "react-router"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/features/nav-bar/navigation-menu";

export function NavigationMenu_1() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/homepage">Trang chủ</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/rooms">Phòng</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/about">Về THOUSAND STARS</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/docs">Liên hệ</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
