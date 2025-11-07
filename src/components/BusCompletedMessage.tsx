import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/types";

interface BusCompletedMessage {
	selectedLocation: Location;
	className?: string;
}

function BusCompletedMessage({
	selectedLocation,
	className,
}: BusCompletedMessage) {
	return (
		<div className={cn("flex flex-col items-center gap-4", className)}>
			{/* Circular background for green tick */}
			<div className="flex items-center justify-center bg-green-500/10 rounded-full p-6 aspect-square">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
			</div>

			{/* Text section */}
			<div className="text-center space-y-2">
				{/* Bus completed message */}
				<h2 className="text-3xl font-bold text-white">
					All Buses Completed for {selectedLocation}!
				</h2>

				{/* More info message */}
				<p className="text-gray-400 text-lg">
					All scheduled buses have departed. Check back later.
				</p>
			</div>
		</div>
	);
}

export default BusCompletedMessage;
