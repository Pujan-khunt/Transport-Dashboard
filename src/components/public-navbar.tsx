"use client";

import { CategoryNav } from "./category-nav";

type Category = "uniworld-1" | "uniworld-2" | "special";

interface PublicNavbarProps {
	selectedCategory: Category;
	onCategoryChange: (category: Category) => void;
}

export function PublicNavbar({
	selectedCategory,
	onCategoryChange,
}: PublicNavbarProps) {
	return (
		<nav className="w-full border-b border-gray-800 bg-black">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Left: Logo + Title + Category Nav */}
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
							<span className="text-white text-sm font-bold">🚌</span>
						</div>
						<h1 className="text-xl font-bold text-white">SST Transit</h1>
					</div>

					<CategoryNav value={selectedCategory} onChange={onCategoryChange} />
				</div>
			</div>
		</nav>
	);
}
