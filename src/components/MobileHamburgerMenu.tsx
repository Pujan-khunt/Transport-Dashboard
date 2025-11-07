import { LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { locations } from "@/app/common";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/types";
import CurrentTimeDisplay from "./CurrentTimeDisplay";
import { Button } from "./ui/button";

function MobileHamburgerMenu({
	selectedCategory,
}: {
	selectedCategory: Location;
}) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden text-white hover:bg-gray-800"
					aria-label="Open navigation menu"
				>
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>

			<SheetContent side="right" className="w-[300px] bg-black border-gray-800">
				<SheetHeader>
					<SheetTitle className="text-white text-left">Menu</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col gap-6 mt-6">
					{/* Current Time */}
					<div>
						<CurrentTimeDisplay className="text-md" />
					</div>

					<Separator className="bg-gray-800" />

					{/* Location Navigation */}
					<div className="space-y-2">
						<h3 className="text-md text-center underline font-semibold text-gray-400 uppercase tracking-wider mb-3">
							Locations
						</h3>
						<div className="flex flex-col items-center text-2xl gap-y-6">
							{locations.map((location) => (
								<SheetClose key={location.value}>
									<Link
										href={`/dashboard?location=${location.value}`}
										className={cn(
											"w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all",
											selectedCategory === location.value
												? "bg-white text-black"
												: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
										)}
									>
										{location.label}
									</Link>
								</SheetClose>
							))}
						</div>
					</div>

					<Separator className="bg-gray-800" />

					{/* Admin Dashboard Button */}
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
