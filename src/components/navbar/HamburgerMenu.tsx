import CurrentTimeDisplay from "@/components/CurrentTimeDisplay";
import HamburgerSheetTrigger from "@/components/HamburgerSheetTrigger";
import MobileLocationNavigation from "@/components/MobileLocationNavigation";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Location } from "@/types/types";
import AdminDashboardButton from "./AdminDashboardButton";
import SignOutButton from "./SignOutButton";
import UserInfo from "./UserInfo";

interface Props {
	username: string | null | undefined;
	email: string | undefined;
	avatar: string | null | undefined;
	status: "authenticated" | "unauthenticated" | "loading";
	selectedCategory: Location;
}

function HamburgerMenu({
	username,
	email,
	avatar,
	status,
	selectedCategory,
}: Props) {
	return (
		<Sheet>
			<HamburgerSheetTrigger />

			<SheetContent side="right" className="w-[300px] bg-black border-gray-800">
				{/* Needed for accessibility reasons */}
				<SheetTitle className="hidden">Sidebar</SheetTitle>

				{status === "authenticated" && (
					<UserInfo username={username} email={email} avatar={avatar} />
				)}

				<Separator className="bg-gray-800" />

				<div className="flex flex-col gap-6">
					{/* Current Time */}
					<CurrentTimeDisplay className="text-md" />

					<Separator className="bg-gray-800" />

					{/* Location Navigation */}
					<MobileLocationNavigation
						locationUrl={
							status === "authenticated" ? "/admin/dashboard" : "/dashboard"
						}
						selectedCategory={selectedCategory}
					/>

					<Separator className="bg-gray-800" />

					{status === "authenticated" ? (
						<SignOutButton className="mx-16" />
					) : (
						<AdminDashboardButton />
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default HamburgerMenu;
