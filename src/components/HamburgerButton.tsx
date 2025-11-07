import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "./ui/sheet";

function HamburgerButton() {
	return (
		<SheetTrigger asChild>
			<Button
				variant="ghost"
				size="icon"
				className="lg:hidden text-white hover:bg-gray-800"
				aria-label="Open navigation menu"
			>
				<Menu className="h-12 w-12" />
			</Button>
		</SheetTrigger>
	);
}

export default HamburgerButton;
