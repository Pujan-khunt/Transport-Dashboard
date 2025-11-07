"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Bus } from "@/db/schema/bus";
import { AdminNavbar } from "../../../components/admin-navbar";
import { BusCard } from "../../../components/bus-card";
import { CreateBusDialog } from "../../../components/create-bus-dialog";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

interface AdminDashboardClientProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	initialBuses: Bus[];
}

export function AdminDashboardClient({
	user,
	initialBuses,
}: AdminDashboardClientProps) {
	const searchParams = useSearchParams();
	const selectedLocation =
		(searchParams.get("location") as Location) || "Uniworld-1";

	// Filter buses based on selected location (source OR destination)
	const filteredBuses = useMemo(() => {
		return initialBuses.filter((bus) => {
			return (
				bus.origin === selectedLocation || bus.destination === selectedLocation
			);
		});
	}, [initialBuses, selectedLocation]);

	// Separate buses into upcoming and completed
	const { upcomingBuses, completedBuses, allCompleted } = useMemo(() => {
		const now = new Date();
		const upcoming: Bus[] = [];
		const completed: Bus[] = [];

		filteredBuses.forEach((bus) => {
			if (new Date(bus.departureTime) > now) {
				upcoming.push(bus);
			} else {
				completed.push(bus);
			}
		});

		return {
			upcomingBuses: upcoming,
			completedBuses: completed,
			allCompleted: upcoming.length === 0 && filteredBuses.length > 0,
		};
	}, [filteredBuses]);

	return (
		<div className="min-h-screen bg-black">
			<AdminNavbar user={user} selectedCategory={selectedLocation} />

			<main className="px-6 py-6">
				{/* Header Section */}
				<div className="flex items-center justify-between mb-8">
					<CreateBusDialog />
				</div>

				{/* All Buses Completed Message */}
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
								All scheduled buses have departed. Add new buses or check other
								locations.
							</p>
						</div>

						{/* Show Completed Buses */}
						{completedBuses.length > 0 && (
							<div className="w-full mt-8">
								<h3 className="text-lg font-semibold mb-4 text-gray-400 text-center">
									Completed Buses ({completedBuses.length})
								</h3>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{completedBuses.map((bus) => (
										<BusCard
											key={bus.id}
											bus={bus}
											isCompleted
											isAdminView // Pass admin view prop
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* No Buses in Location */}
				{!allCompleted && filteredBuses.length === 0 && (
					<div className="flex flex-col items-center justify-center py-24 space-y-4">
						<p className="text-xl font-semibold text-gray-400">
							No buses scheduled
						</p>
						<p className="text-sm text-gray-500">
							No buses found for {selectedLocation}
						</p>
						<CreateBusDialog />
					</div>
				)}

				{/* Upcoming Buses Grid */}
				{upcomingBuses.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-white">
							Upcoming Buses ({upcomingBuses.length})
						</h3>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{upcomingBuses.map((bus) => (
								<BusCard
									key={bus.id}
									bus={bus}
									isAdminView // Pass admin view prop
								/>
							))}
						</div>
					</div>
				)}

				{/* Completed Buses (when there are also upcoming buses) */}
				{!allCompleted && completedBuses.length > 0 && (
					<div className="mt-12">
						<h3 className="text-lg font-semibold mb-4 text-gray-500">
							Completed ({completedBuses.length})
						</h3>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{completedBuses.map((bus) => (
								<BusCard
									key={bus.id}
									bus={bus}
									isCompleted
									isAdminView // Pass admin view prop
								/>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
