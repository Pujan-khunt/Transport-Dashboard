import { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense>
				<Navbar />
			</Suspense>
			{children}
		</>
	);
}

export default DashboardLayout;
