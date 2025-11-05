"use client";

import { cn } from "@/lib/utils";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface CategoryNavProps {
	value: Location;
	onChange: (value: Location) => void;
	className?: string;
}

export function CategoryNav({ value, onChange, className }: CategoryNavProps) {
	const locations: { value: Location; label: string }[] = [
		{ value: "Uniworld-1", label: "Uniworld 1" },
		{ value: "Uniworld-2", label: "Uniworld 2" },
		{ value: "Macro", label: "Macro" },
		{ value: "Special", label: "Special" },
	];

	return (
		<nav className={cn("flex items-center gap-2", className)}>
			{locations.map((location) => (
				<button
					key={location.value}
					onClick={() => onChange(location.value)}
					className={cn(
						"px-6 py-2 rounded-md font-medium transition-all",
						value === location.value
							? "bg-white text-black shadow-sm"
							: "text-gray-400 hover:text-gray-200",
					)}
				>
					{location.label}
				</button>
			))}
		</nav>
	);
}
