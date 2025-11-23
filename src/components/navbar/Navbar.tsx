"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Location } from "@/types/types";
import CurrentTimeDisplay from "../CurrentTimeDisplay";
import DashboardAdminButton from "../DashboardAdminButton";
import DashboardCategoryNavigation from "../DashboardCategoryNavigation";
import DashboardLogoTitle from "../DashboardLogoTitle";
import HamburgerMenu from "./HamburgerMenu";
import SignOutButton from "./SignOutButton";
import UserInfo from "./UserInfo";

function Navbar() {
    const searchParams = useSearchParams();
    const selectedCategory: Location =
        (searchParams.get("location") as Location) || "Uniworld-1";

    const { data: session, status } = useSession();
    const username = session?.user.name;
    const email = session?.user.email;
    const avatar = session?.user.image;

    return (
        <nav className="w-full border-b border-gray-800 bg-black sticky top-0 z-50">
            <div className="mx-auto px-4 lg:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo + Title on left */}
                    <DashboardLogoTitle />

                    {/* Desktop Category Navigation (hidden on mobile) */}
                    <DashboardCategoryNavigation selectedCategory={selectedCategory} />

                    {/* Current Time */}
                    <CurrentTimeDisplay />

                    {/* Login as admin button - Only shown when NOT logged in */}
                    {status === "unauthenticated" && <DashboardAdminButton />}

                    {/* Display user info when logged in */}
                    {status === "authenticated" && (
                        <div className="hidden md:flex items-center gap-x-8">
                            <UserInfo
                                username={username}
                                avatar={avatar}
                                
                                email={email || undefined}
                                className="mb-6"
                            />
                            <SignOutButton />
                        </div>
                    )}

                    {/* Hamburger Menu For Mobile Screens */}
                    <HamburgerMenu
                        selectedCategory={selectedCategory}
                        username={username}
                       
                        email={email || undefined}
                        avatar={avatar}
                        status={status}
                    />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;