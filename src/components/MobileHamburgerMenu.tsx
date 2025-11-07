import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import CurrentTimeDisplay from "@/components/CurrentTimeDisplay";
import DashboardAdminButton from "@/components/DashboardAdminButton";
import HamburgerSheetTrigger from "@/components/HamburgerSheetTrigger";
import MobileLocationNavigation from "@/components/MobileLocationNavigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import type { Location } from "@/types/types";

function MobileHamburgerMenu({
	selectedCategory,
}: {
	selectedCategory: Location;
}) {
	return (
		<Sheet>
			<HamburgerSheetTrigger />

			<SheetContent side="right" className="w-[300px] bg-black border-gray-800">
				<SheetTitle className="hidden">Sidebar</SheetTitle>

				<Separator className="bg-gray-800" />

				<div className="flex flex-col gap-6">
					{/* Current Time */}
					<CurrentTimeDisplay className="text-md" />

					<Separator className="bg-gray-800" />

					{/* Location Navigation */}
					<MobileLocationNavigation
						locationUrl="/dashboard"
						selectedCategory={selectedCategory}
					/>

					<Separator className="bg-gray-800" />

					{/* Admin Dashboard Button */}
					<DashboardAdminButton />
					<Button
						asChild
						variant="outline"
						className="justify-center mx-10 py-4 border-gray-700 text-gray-300 bg-black hover:bg-gray-800 hover:text-white"
					>
						<Link href="/admin/dashboard">
							<LayoutDashboard className="mr-2 h-4 w-4" />
							Admin Dashboard
						</Link>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default MobileHamburgerMenu;
