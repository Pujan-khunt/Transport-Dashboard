"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CurrentTimeDisplay from "../CurrentTimeDisplay";
import DesktopCategoryNavigation from "../DashboardCategoryNavigation";
import DashboardLogoTitle from "../DashboardLogoTitle";
import MobileHamburgerMenuAdmin from "../MobileHamburgerMenuAdmin";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface AdminNavbarProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	selectedCategory: Location;
}

export function AdminNavbar({ user, selectedCategory }: AdminNavbarProps) {
	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() || "?";

	return (
		<nav className="w-full border-b border-gray-800 bg-black sticky top-0 z-50">
			<div className="mx-auto px-4 lg:px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Left: Logo + Title */}
					<DashboardLogoTitle />

					{/* Center: Desktop Category Navigation (hidden on mobile) */}
					<DesktopCategoryNavigation selectedCategory={selectedCategory} />

					{/* Right: Desktop User Section (hidden on mobile) */}
					<CurrentTimeDisplay />
					<div className="hidden lg:flex items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-sm font-medium text-white">{user.name}</p>
								<p className="text-xs text-gray-400">{user.email}</p>
							</div>

							<Avatar className="h-9 w-9">
								<AvatarImage
									src={user.image || undefined}
									alt={user.name || ""}
								/>
								<AvatarFallback className="bg-purple-600 text-white">
									{initials}
								</AvatarFallback>
							</Avatar>

							<Button
								asChild
								variant="ghost"
								size="sm"
								className="text-gray-400 hover:text-white hover:bg-gray-800"
							>
								<Link href="/auth/signout">
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</Link>
							</Button>
						</div>
					</div>

					{/* Right: Mobile Hamburger Menu */}
					<MobileHamburgerMenuAdmin
						initials={initials}
						user={user}
						selectedCategory={selectedCategory}
					/>
				</div>
			</div>
		</nav>
	);
}
