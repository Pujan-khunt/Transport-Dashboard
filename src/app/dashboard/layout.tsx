"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/public-navbar";
import type { Location } from "@/types/types";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [selectedLocation, setSelectedLocation] =
		useState<Location>("Uniworld-1");

	return (
		<>
			<PublicNavbar
				selectedCategory={selectedLocation}
				onCategoryChange={setSelectedLocation}
			/>
			{children}
		</>
	);
}

export default DashboardLayout;
