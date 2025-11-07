import { cn } from "@/lib/utils";

interface DashboardLogoTitleProps {
	className?: string;
}

function DashboardLogoTitle({ className }: DashboardLogoTitleProps) {
	return (
		<div className={cn("flex items-center gap-3 shrink-0", className)}>
			<div className="h-8 w-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
				<span className="text-white text-sm font-bold">🚌</span>
			</div>
			<h1 className="text-xl font-bold text-white">SST Transit</h1>
		</div>
	);
}

export default DashboardLogoTitle;
