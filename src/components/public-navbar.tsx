"use client";

import { LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { CurrentTimeDisplay } from "./current-time-display";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

export function PublicNavbar() {
	const searchParams = useSearchParams();
	const selectedCategory = searchParams.get("location") || "Uniworld-1";

	const locations: { value: Location; label: string }[] = [
		{ value: "Uniworld-1", label: "Uniworld 1" },
		{ value: "Uniworld-2", label: "Uniworld 2" },
		{ value: "Macro", label: "Macro Campus" },
		{ value: "Special", label: "Special" },
	];

	return (
		<nav className="w-full border-b border-gray-800 bg-black sticky top-0 z-50">
			<div className="mx-auto px-4 lg:px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Left: Logo + Title */}
					<div className="flex items-center gap-3 shrink-0">
						<div className="h-8 w-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
							<span className="text-white text-sm font-bold">🚌</span>
						</div>
						<h1 className="text-xl font-bold text-white">SST Transit</h1>
					</div>

					{/* Center: Desktop Category Navigation (hidden on mobile) */}
					<nav className="hidden lg:flex items-center gap-2">
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

					{/* Right: Desktop Time + Admin Button (hidden on mobile) */}
					<div className="hidden lg:flex items-center gap-4">
						<CurrentTimeDisplay className="" />

						<Button
							asChild
							variant="outline"
							size="sm"
							className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
						>
							<Link href="/admin/dashboard">
								<LayoutDashboard className="mr-2 h-4 w-4" />
								Admin
							</Link>
						</Button>
					</div>

					{/* Right: Mobile Hamburger Menu */}
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

						<SheetContent
							side="right"
							className="w-[300px] bg-black border-gray-800"
						>
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
				</div>
			</div>
		</nav>
	);
}
