import { PublicNavbar } from "@/components/public-navbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<PublicNavbar />
			{children}
		</>
	);
}

export default DashboardLayout;
