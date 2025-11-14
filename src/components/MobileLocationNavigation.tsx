import Link from "next/link";
import { locations } from "@/app/common";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/types";

interface MobileLocationNavigationProps {
	selectedCategory: Location;
}

function MobileLocationNavigation({
	selectedCategory,
}: MobileLocationNavigationProps) {
	return (
		<div className="space-y-2">
			<h3 className="text-md text-center underline font-semibold text-gray-400 uppercase tracking-wider mb-3">
				Locations
			</h3>
			<div className="flex flex-col items-center text-2xl gap-y-6">
				{locations.map((location) => (
					<SheetClose key={location.value}>
						<Link
							href={`/dashboard?location=${location.value}`}
							prefetch={true}
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
	);
}

export default MobileLocationNavigation;
