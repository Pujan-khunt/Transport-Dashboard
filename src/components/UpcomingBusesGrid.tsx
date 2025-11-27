import { BusCard } from "@/components/BusCard";
import type { Bus } from "@/db/schema/bus";

function UpcomingBusesGrid({ upcomingBuses, isAdmin}: { upcomingBuses: Bus[], isAdmin: boolean }) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">
				Upcoming Buses ({upcomingBuses.length})
			</h3>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{upcomingBuses.map((bus) => (
					<BusCard key={bus.id} bus={bus} isAdminView={isAdmin} />
				))}
			</div>
		</div>
	);
}

export default UpcomingBusesGrid;
