"use client";

import { CategoryNav } from "./category-nav";
import { CurrentTimeDisplay } from "./current-time-display";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface PublicNavbarProps {
	selectedCategory: Location;
	onCategoryChange: (category: Location) => void;
}

export function PublicNavbar({
	selectedCategory,
	onCategoryChange,
}: PublicNavbarProps) {
	return (
		<nav className="w-full border-b border-gray-800 bg-black">
			<div className="flex h-16 items-center justify-between px-6">
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
							<span className="text-white text-sm font-bold">🚌</span>
						</div>
						<h1 className="text-xl font-bold text-white">SST Transit</h1>
					</div>

					<CategoryNav value={selectedCategory} onChange={onCategoryChange} />
				</div>
				<CurrentTimeDisplay />
			</div>
		</nav>
	);
}
