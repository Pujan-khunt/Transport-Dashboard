import { BusCard } from "@/components/BusCard";

import type { Bus } from "@/db/schema/bus";
import { cn } from "@/lib/utils";

interface CompletedBusesGridProps {
	completedBuses: Bus[];
	className?: string;
}

function CompletedBusesGrid({
	completedBuses,
	className,
}: CompletedBusesGridProps) {
	return (
		<div className={cn("w-full mt-8", className)}>
			<h3 className="text-lg font-semibold mb-4 text-gray-400 text-center">
				Completed Buses ({completedBuses.length})
			</h3>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{completedBuses.map((bus) => (
					<BusCard key={bus.id} bus={bus} isCompleted />
				))}
			</div>
		</div>
	);
}

export default CompletedBusesGrid;
