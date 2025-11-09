"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { locations } from "@/app/common";
import CurrentTimeDisplay from "@/components/CurrentTimeDisplay";
import { Button } from "@/components/ui/button";
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

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface CategoryNavProps {
	value: Location;
	locationUrl: "/admin/dashboard" | "/dashboard";
	className?: string;
}

export function CategoryNav({
	value,
	locationUrl,
	className,
}: CategoryNavProps) {
	return (
		<nav className={cn(className)}>
			{/* Desktop Nav */}
			<div className="hidden items-center gap-2 md:flex">
				{locations.map((location) => (
					<Link
						href={`${locationUrl}?location=${location.value}`}
						key={location.value}
						className={cn(
							"px-6 py-2 font-medium transition-all",
							value === location.value
								? "bg-white text-black shadow-sm hover:bg-white/90"
								: "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
						)}
					>
						{location.label}
					</Link>
				))}
			</div>

			{/* Mobile Nav (Hamburger) */}
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-white hover:bg-gray-800 hover:text-white"
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="flex flex-col bg-black border-gray-800 text-white"
					>
						<SheetHeader>
							<SheetTitle className="text-white">SST Transit</SheetTitle>
						</SheetHeader>

						{/* Add Current Time Here */}
						<div className="py-4">
							<CurrentTimeDisplay variant="compact" />
						</div>
						<Separator className="bg-gray-700" />

						<div className="grid gap-2 py-4">
							<p className="text-sm font-medium text-gray-400 px-2">
								Locations
							</p>
							{locations.map((location) => (
								<SheetClose asChild key={location.value}>
									<Link
										href={`${locationUrl}?location=${location.value}`}
										className={cn(
											"w-full justify-start gap-2 text-base",
											value === location.value
												? "bg-white text-black"
												: "text-gray-400 hover:text-gray-200",
										)}
									>
										{location.label}
									</Link>
								</SheetClose>
							))}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
