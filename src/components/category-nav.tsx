"use client";

import { cn } from "@/lib/utils";

type Category = "uniworld-1" | "uniworld-2" | "special";

interface CategoryNavProps {
	value: Category;
	onChange: (value: Category) => void;
	className?: string;
}

export function CategoryNav({ value, onChange, className }: CategoryNavProps) {
	const categories: { value: Category; label: string }[] = [
		{ value: "uniworld-1", label: "Uniworld 1" },
		{ value: "uniworld-2", label: "Uniworld 2" },
		{ value: "special", label: "Special" },
	];

	return (
		<nav className={cn("flex items-center gap-2", className)}>
			{categories.map((category) => (
				<button
					key={category.value}
					onClick={() => onChange(category.value)}
					className={cn(
						"px-6 py-2 rounded-md text-sm font-medium transition-all",
						value === category.value
							? "bg-white text-black shadow-sm"
							: "text-gray-400 hover:text-gray-200",
					)}
				>
					{category.label}
				</button>
			))}
		</nav>
	);
}
