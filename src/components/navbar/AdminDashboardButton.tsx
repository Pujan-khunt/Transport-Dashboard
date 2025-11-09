import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

function AdminDashboardButton() {
	return (
		<Button
			asChild
			variant="outline"
			className="justify-center mx-10 py-4 border-gray-700 text-gray-300 bg-black hover:bg-gray-800 hover:text-white"
		>
			<Link href="auth/signin">
				<LayoutDashboard className="mr-2 h-4 w-4" />
				Admin Dashboard
			</Link>
		</Button>
	);
}

export default AdminDashboardButton;
