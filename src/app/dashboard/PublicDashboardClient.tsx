"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BusCard } from "@/components/BusCard";
import BusCompletedMessage from "@/components/BusCompletedMessage";
import CompletedBusesGrid from "@/components/CompletedBusesGrid";
import LoadingIndicator from "@/components/LoadingIndicator";
import NoBusMessage from "@/components/NoBusMessage";
import UpcomingBusesGrid from "@/components/UpcomingBusesGrid";
import type { Bus } from "@/db/schema/bus";
import type { Location } from "@/types/types";
import { CreateBusDialog } from "@/components/CreateBusDialog";
import CsvUploadButton from "@/components/UploadButton";

const POLLING_INTERVAL_MS = 30 * 1000; // 30 seconds

interface PublicDashboardClientProps {
	initialBuses: Bus[];
	isAdmin: boolean;
}

export function PublicDashboardClient({
	initialBuses,
	isAdmin,
}: PublicDashboardClientProps) {
	const searchParams = useSearchParams();
	const selectedLocation =
		(searchParams.get("location") as Location) || "Uniworld-1";

	// Use state to hold buses, initializing with server-fetched data
	const [buses, setBuses] = useState<Bus[]>(initialBuses);
	const [isFetching, setIsFetching] = useState<boolean>(false); // To show loading state

	// Polling logic
	useEffect(() => {
		const fetchBuses = async () => {
			setIsFetching(true);
			try {
				const response = await fetch("/api/buses"); // Call our new GET endpoint
				if (!response.ok) {
					throw new Error("Failed to fetch buses");
				}
				const newBuses: Bus[] = await response.json();
				setBuses(newBuses); // Update the state with new data
			} catch (error) {
				console.error("Error polling for buses:", error);
			} finally {
				setIsFetching(false);
			}
		};

		// Set up the interval
		const intervalId = setInterval(fetchBuses, POLLING_INTERVAL_MS);

		// Clean up the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	// filteredBuses are buses which have either src or dest as the selected location.
	const filteredBuses = useMemo(() => {
		return buses.filter((bus) => {
			return (
				bus.origin === selectedLocation || bus.destination === selectedLocation
			);
		});
	}, [buses, selectedLocation]);

	// Segregate filtered buses into upcoming and completed. Also store total number of buses.
	const { upcomingBuses, completedBuses, allCompleted } = useMemo(() => {
		const now = new Date();
		const upcoming: Bus[] = [];
		const completed: Bus[] = [];

		filteredBuses.forEach((bus) => {
			const departureTime = new Date(bus.departureTime);
			const completedTime = new Date(departureTime.getTime());

			if (completedTime > now) {
				upcoming.push(bus);
			} else {
				completed.push(bus);
			}
		});

		// Sort upcoming buses by departure time
		// upcoming.sort(
		// 	(a, b) =>
		// 		new Date(a.departureTime).getTime() -
		// 		new Date(b.departureTime).getTime(),
		// );
		
		// Sort completed buses by departure time (most recent first)
		// completed.sort(
		// 	(a, b) =>
		// 		new Date(b.departureTime).getTime() -
		// 		new Date(a.departureTime).getTime(),
		// );

		return {
			upcomingBuses: upcoming,
			completedBuses: completed,
			allCompleted: upcoming.length === 0 && filteredBuses.length > 0,
		};
	}, [filteredBuses]);

	return (
		<div className="min-h-screen bg-black">
			{/* Display "Updating..." when fetching bus data from server */}
			{isFetching && <LoadingIndicator />}

			{isAdmin && (
				<div className="flex items-center justify-between p-4">
					<CreateBusDialog />
					<CsvUploadButton />
				</div>
			)}

			<main className="px-6 py-6">
				{allCompleted && (
					<div className="flex flex-col items-center justify-center py-16 space-y-6">
						{/* If all buses are completed, show completed buses message */}
						<BusCompletedMessage selectedLocation={selectedLocation} />

						{/* Display all the completed buses if all existing ones are completed */}
						{completedBuses.length > 0 && (
							<CompletedBusesGrid completedBuses={completedBuses} />
						)}
					</div>
				)}

				{/* Show no buses scheduled message if buses are remaining but don't have src/dest as selected location*/}
				{!allCompleted && filteredBuses.length === 0 && (
					<NoBusMessage selectedLocation={selectedLocation} />
				)}

				{/* Display all the upcoming scheduled buses for the currently selected location*/}
				{upcomingBuses.length > 0 && (
					<UpcomingBusesGrid upcomingBuses={upcomingBuses} />
				)}

				{/* Display all the completed bus for the currently selected location */}
				{!allCompleted && completedBuses.length > 0 && (
					<div className="mt-12">
						<h3 className="text-lg font-semibold mb-4 text-gray-500">
							Completed ({completedBuses.length})
						</h3>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{completedBuses.map((bus) => (
								<BusCard key={bus.id} bus={bus} isCompleted />
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
