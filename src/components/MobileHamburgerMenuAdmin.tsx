import { LogOut } from "lucide-react";
import Link from "next/link";
import HamburgerSheetTrigger from "@/components/HamburgerSheetTrigger";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Location } from "@/types/types";
import CurrentTimeDisplay from "./CurrentTimeDisplay";
import MobileLocationNavigation from "./MobileLocationNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface MobileHamburgerMenuAdminProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	selectedCategory: Location;
	initials: string;
}

function MobileHamburgerMenuAdmin({
	user,
	selectedCategory,
	initials,
}: MobileHamburgerMenuAdminProps) {
	return (
		<>
			<Sheet>
				<HamburgerSheetTrigger />

				<SheetContent
					side="right"
					className="w-[300px] bg-black border-gray-800"
				>
					<SheetTitle className="hidden">Sidebar</SheetTitle>

					<div className="flex flex-col gap-6 mt-6">
						{/* User Info */}
						<div className="flex items-center justify-center gap-4">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={user.image || undefined}
									alt={user.name || ""}
								/>
								<AvatarFallback className="bg-purple-600 text-white">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-sm font-medium text-white">{user.name}</p>
								<p className="text-xs text-gray-400">{user.email}</p>
							</div>
						</div>

						<Separator className="bg-gray-800" />

						{/* Current Time */}
						<CurrentTimeDisplay />

						<Separator className="bg-gray-800" />

						{/* Location Navigation */}
						<MobileLocationNavigation
							locationUrl="/admin/dashboard"
							selectedCategory={selectedCategory}
						/>

						<Separator className="bg-gray-800" />

						{/* Sign Out */}
						<Button asChild variant="destructive" className="mx-16">
							<Link href="/auth/signout">
								<LogOut className="mr-1 h-4 w-4" />
								Sign Out
							</Link>
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}

export default MobileHamburgerMenuAdmin;
