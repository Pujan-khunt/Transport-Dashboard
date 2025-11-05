"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { CategoryNav } from "./category-nav";
import Link from "next/link";
import Image from "next/image";

type Category = "uniworld-1" | "uniworld-2" | "special";

interface AdminNavbarProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	selectedCategory: Category;
	onCategoryChange: (category: Category) => void;
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

				{/* Right: User Info + Sign Out */}
				<div className="flex items-center gap-4">
					<div className="hidden md:flex flex-col items-end">
						<span className="text-sm font-medium text-white">{user.name}</span>
						<span className="text-xs text-gray-400">{user.email}</span>
					</div>

					<Avatar className="h-9 w-9">
						<AvatarImage src={user.image || undefined} alt={user.name || ""} />
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
		</nav>
	);
}
