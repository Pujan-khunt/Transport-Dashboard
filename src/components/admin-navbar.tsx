"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CurrentTimeDisplay } from "./current-time-display";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface AdminNavbarProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	selectedCategory: Location;
	onCategoryChange: (category: Location) => void;
}

export function AdminNavbar({
	user,
	selectedCategory,
	onCategoryChange,
}: AdminNavbarProps) {
	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() || "?";

	const locations: { value: Location; label: string }[] = [
		{ value: "Uniworld-1", label: "Uniworld 1" },
		{ value: "Uniworld-2", label: "Uniworld 2" },
		{ value: "Macro", label: "Macro" },
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
							<button
								key={location.value}
								onClick={() => onCategoryChange(location.value)}
								className={cn(
									"px-6 py-2 rounded-md text-sm font-medium transition-all",
									selectedCategory === location.value
										? "bg-white text-black shadow-sm"
										: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
								)}
							>
								{location.label}
							</button>
						))}
					</nav>

					{/* Right: Desktop User Section (hidden on mobile) */}
					<div className="hidden lg:flex items-center gap-4">
						<CurrentTimeDisplay />

						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-sm font-medium text-white">{user.name}</p>
								<p className="text-xs text-gray-400">{user.email}</p>
							</div>

							<Avatar className="h-9 w-9">
								<AvatarImage
									src={user.image || undefined}
									alt={user.name || ""}
								/>
								<AvatarFallback className="bg-purple-600 text-white">
									{initials}
								</AvatarFallback>
							</Avatar>

							<Button
								asChild
								variant="ghost"
								size="sm"
								className="text-gray-400 hover:text-white hover:bg-gray-800"
							>
								<Link href="/auth/signout">
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</Link>
							</Button>
						</div>
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
								{/* User Info */}
								<div className="flex items-center gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={user.image || undefined}
											alt={user.name || ""}
										/>
										<AvatarFallback className="bg-purple-600 text-white">
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="text-sm font-medium text-white">
											{user.name}
										</p>
										<p className="text-xs text-gray-400">{user.email}</p>
									</div>
								</div>

								<Separator className="bg-gray-800" />

								{/* Current Time */}
								<div>
									<CurrentTimeDisplay />
								</div>

								<Separator className="bg-gray-800" />

								{/* Location Navigation */}
								<div className="space-y-2">
									<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Locations
									</h3>
									{locations.map((location) => (
										<SheetClose key={location.value} asChild>
											<button
												onClick={() => onCategoryChange(location.value)}
												className={cn(
													"w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all",
													selectedCategory === location.value
														? "bg-white text-black"
														: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
												)}
											>
												{location.label}
											</button>
										</SheetClose>
									))}
								</div>

								<Separator className="bg-gray-800" />

								{/* Sign Out */}
								<Button
									asChild
									variant="destructive"
									className="w-full justify-start"
								>
									<Link href="/auth/signout">
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
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
