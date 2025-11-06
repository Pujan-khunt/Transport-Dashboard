import { CheckCircle2 } from "lucide-react";
import type { Location } from "@/types/types";

function BusCompletedMessage({
	selectedLocation,
}: {
	selectedLocation: Location;
}) {
	return (
		<>
			<div className="rounded-full bg-green-500/10 p-6">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
			</div>
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold text-white">
					All Buses Completed for {selectedLocation}!
				</h2>
				<p className="text-gray-400 text-lg">
					All scheduled buses have departed. Check back later.
				</p>
			</div>
		</>
	);
}

export default BusCompletedMessage;
