import { LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props {
	className?: string;
}

function SignOutButton({ className }: Props) {
	return (
		<Button
			asChild
			variant="outline"
			size="sm"
			className={cn("hover:text-white hover:bg-gray-800", className)}
		>
			<Link href="/auth/signout" className="flex items-center">
				<LogOut className="mr-2 h-4 w-4" />
				<div>Sign Out</div>
			</Link>
		</Button>
	);
}

export default SignOutButton;
