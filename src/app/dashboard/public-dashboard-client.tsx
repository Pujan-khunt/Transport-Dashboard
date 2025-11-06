"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BusCard } from "@/components/bus-card";
import { PublicNavbar } from "@/components/public-navbar";
import type { Bus } from "@/db/schema/bus";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";
const POLLING_INTERVAL_MS = 30 * 1000; // 30 seconds

interface PublicDashboardClientProps {
	initialBuses: Bus[];
}

export function PublicDashboardClient({
	initialBuses,
}: PublicDashboardClientProps) {
	// Use state to hold buses, initializing with server-fetched data
	const [buses, setBuses] = useState<Bus[]>(initialBuses);
	const [selectedLocation, setSelectedLocation] =
		useState<Location>("Uniworld-1");
	const [isFetching, setIsFetching] = useState(false); // To show loading state

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
	}, []); // Empty dependency array means this runs once on mount

	const filteredBuses = useMemo(() => {
		// IMPORTANT: Use the 'buses' state variable, not 'initialBuses'
		return buses.filter((bus) => {
			return (
				bus.origin === selectedLocation || bus.destination === selectedLocation
			);
		});
	}, [buses, selectedLocation]); // Depend on 'buses' state

	const { upcomingBuses, completedBuses, allCompleted } = useMemo(() => {
		const now = new Date();
		const upcoming: Bus[] = [];
		const completed: Bus[] = [];

		filteredBuses.forEach((bus) => {
			// Add a 5-minute grace period for "completed" status
			const departureTime = new Date(bus.departureTime);
			const completedTime = new Date(departureTime.getTime() + 5 * 60000); // 5 minutes after departure

			if (completedTime > now) {
				upcoming.push(bus);
			} else {
				completed.push(bus);
			}
		});

		// Sort upcoming buses by departure time
		upcoming.sort(
			(a, b) =>
				new Date(a.departureTime).getTime() -
				new Date(b.departureTime).getTime(),
		);

		// Sort completed buses by departure time (most recent first)
		completed.sort(
			(a, b) =>
				new Date(b.departureTime).getTime() -
				new Date(a.departureTime).getTime(),
		);

		return {
			upcomingBuses: upcoming,
			completedBuses: completed,
			allCompleted: upcoming.length === 0 && filteredBuses.length > 0,
		};
	}, [filteredBuses]);

	return (
		<div className="min-h-screen bg-black">
			<PublicNavbar
				selectedCategory={selectedLocation}
				onCategoryChange={setSelectedLocation}
			/>

			{/* Loading indicator for polling */}
			{isFetching && (
				<div className="fixed bottom-4 right-4 z-50">
					<div className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white border border-gray-700 shadow-lg">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Updating...</span>
					</div>
				</div>
			)}

			<main className="px-6 py-6">
				{allCompleted && (
					<div className="flex flex-col items-center justify-center py-16 space-y-6">
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

						{completedBuses.length > 0 && (
							<div className="w-full mt-8">
								<h3 className="text-lg font-semibold mb-4 text-gray-400 text-center">
									Completed Buses ({completedBuses.length})
								</h3>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{completedBuses.map((bus) => (
										<BusCard key={bus.id} bus={bus} isCompleted />
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{!allCompleted && filteredBuses.length === 0 && (
					<div className="flex flex-col items-center justify-center py-24">
						<p className="text-xl font-semibold text-gray-400">
							No buses scheduled
						</p>
						<p className="text-sm text-gray-500 mt-2">
							No buses found for {selectedLocation}
						</p>
					</div>
				)}

				{upcomingBuses.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-white">
							Upcoming Buses ({upcomingBuses.length})
						</h3>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{upcomingBuses.map((bus) => (
								<BusCard key={bus.id} bus={bus} />
							))}
						</div>
					</div>
				)}

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
