"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { CurrentTimeDisplay } from "./current-time-display"; // Import

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface CategoryNavProps {
	value: Location;
	onChange: (value: Location) => void;
	className?: string;
	showAdminButton?: boolean;
}

export function CategoryNav({
	value,
	onChange,
	className,
	showAdminButton = false,
}: CategoryNavProps) {
	const locations: { value: Location; label: string }[] = [
		{ value: "Uniworld-1", label: "Uniworld 1" },
		{ value: "Uniworld-2", label: "Uniworld 2" },
		{ value: "Macro", label: "Macro" },
		{ value: "Special", label: "Special" },
	];

	return (
		<nav className={cn(className)}>
			{/* Desktop Nav */}
			<div className="hidden items-center gap-2 md:flex">
				{locations.map((location) => (
					<Button
						key={location.value}
						variant={value === location.value ? "default" : "ghost"}
						onClick={() => onChange(location.value)}
						className={cn(
							"px-6 py-2 font-medium transition-all",
							value === location.value
								? "bg-white text-black shadow-sm hover:bg-white/90"
								: "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
						)}
					>
						{location.label}
					</Button>
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
									<Button
										onClick={() => onChange(location.value)}
										variant={value === location.value ? "secondary" : "ghost"}
										className={cn(
											"w-full justify-start gap-2 text-base",
											value === location.value
												? "bg-white text-black"
												: "text-gray-400 hover:text-gray-200",
										)}
									>
										{location.label}
									</Button>
								</SheetClose>
							))}
						</div>
						{showAdminButton && (
							<>
								<Separator className="bg-gray-700" />
								<div className="grid gap-2 py-4">
									<SheetClose asChild>
										<Button
											asChild
											variant="ghost"
											className="w-full justify-start gap-2 text-base text-gray-400 hover:text-gray-200"
										>
											<Link href="/admin/dashboard">
												<LayoutDashboard className="h-5 w-5" />
												Admin Dashboard
											</Link>
										</Button>
									</SheetClose>
								</div>
							</>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
