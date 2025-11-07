import { Suspense } from "react";
import { PublicNavbar } from "@/components/PublicNavbar";

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
