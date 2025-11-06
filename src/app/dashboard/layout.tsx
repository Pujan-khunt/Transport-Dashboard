import { Suspense } from "react";
import { PublicNavbar } from "@/components/public-navbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense>
				<PublicNavbar />
			</Suspense>
			{children}
		</>
	);
}

export default DashboardLayout;
