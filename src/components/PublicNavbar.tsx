"use client";

import { useSearchParams } from "next/navigation";

import CurrentTimeDisplay from "@/components/CurrentTimeDisplay";
import DesktopCategoryNavigation from "@/components/DashboardCategoryNavigation";
import DashboardLogoTitle from "@/components/DashboardLogoTitle";
import DesktopAdminButton from "@/components/DesktopAdminButton";
import MobileHamburgerMenu from "@/components/MobileHamburgerMenu";

import type { Location } from "@/types/types";

export function PublicNavbar() {
	const searchParams = useSearchParams();
	const selectedCategory: Location =
		(searchParams.get("location") as Location) || "Uniworld-1";

	return (
		<nav className="w-full border-b border-gray-800 bg-black sticky top-0 z-50">
			<div className="mx-auto px-4 lg:px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Left: Logo + Title */}
					<DashboardLogoTitle />

					{/* Center: Desktop Category Navigation (hidden on mobile) */}
					<DesktopCategoryNavigation selectedCategory={selectedCategory} />

					{/* Right: Desktop Time + Admin Button (hidden on mobile) */}
					<CurrentTimeDisplay />
					<DesktopAdminButton />

					{/* Right: Mobile Hamburger Menu */}
					<MobileHamburgerMenu selectedCategory={selectedCategory} />
				</div>
			</div>
		</nav>
	);
}
