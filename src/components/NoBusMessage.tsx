import type { Location } from "@/types/types";

function NoBusMessage({ selectedLocation }: { selectedLocation: Location }) {
	return (
		<div className="flex flex-col items-center justify-center py-24">
			<p className="text-xl font-semibold text-gray-400">No buses scheduled</p>
			<p className="text-sm text-gray-500 mt-2">
				No buses found for {selectedLocation}
			</p>
		</div>
	);
}

export default NoBusMessage;
