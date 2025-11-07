import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface DashboardAdminButtonProps {
	className?: string;
}

function DashboardAdminButton({ className }: DashboardAdminButtonProps) {
	return (
		<div className={cn("hidden lg:flex items-center gap-4", className)}>
			<Button
				asChild
				variant="default"
				size="sm"
				className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
			>
				<Link href="/admin/dashboard">
					<LayoutDashboard className="mr-2 h-4 w-4" />
					Admin
				</Link>
			</Button>
		</div>
	);
}

export default DashboardAdminButton;
