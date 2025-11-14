import Link from "next/link";
import { locations } from "@/app/common";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/types";

interface DesktopCategoryNavigationProps {
	selectedCategory: Location;
	className?: string;
}

function DesktopCategoryNavigation({
	selectedCategory,
	className,
}: DesktopCategoryNavigationProps) {
	return (
		<nav className={cn("hidden lg:flex items-center gap-2", className)}>
			{locations.map((location) => (
				<Link
					href={`/dashboard?location=${location.value}`}
					key={location.value}
					className={cn(
						"px-6 py-2 rounded-md text-sm font-medium transition-all",
						selectedCategory === location.value
							? "bg-white text-black shadow-sm"
							: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
					)}
				>
					{location.label}
				</Link>
			))}
		</nav>
	);
}

export default DesktopCategoryNavigation;
