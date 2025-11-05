"use client";

import { useState, useMemo } from "react";
import { AdminNavbar } from "@/components/admin-navbar";
import { BusCard } from "@/components/bus-card";
import { CreateBusDialog } from "@/components/create-bus-dialog";
import { CurrentTimeDisplay } from "@/components/current-time-display";
import { CheckCircle2 } from "lucide-react";
import type { Bus } from "@/db/schema/bus";

type Category = "uniworld-1" | "uniworld-2" | "special";

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
	const [selectedCategory, setSelectedCategory] =
		useState<Category>("uniworld-1");

	// Filter buses based on selected category
	const filteredBuses = useMemo(() => {
		return initialBuses.filter((bus) => {
			return bus.category === selectedCategory;
		});
	}, [initialBuses, selectedCategory]);

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
			allCompleted: upcoming.length === 0 && completed.length > 0,
		};
	}, [filteredBuses]);

	return (
		<div className="min-h-screen bg-black">
			<AdminNavbar
				user={user}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>

			<main className="px-6 py-6">
				{/* Header Section */}
				<div className="flex items-center justify-between mb-8">
					<CurrentTimeDisplay />
					<CreateBusDialog />
				</div>

				{/* All Buses Completed Message */}
				{allCompleted && (
					<div className="flex flex-col items-center justify-center py-24 space-y-4">
						<div className="rounded-full bg-green-500/10 p-6">
							<CheckCircle2 className="h-16 w-16 text-green-500" />
						</div>
						<h2 className="text-3xl font-bold text-white">
							All Buses Completed!
						</h2>
						<p className="text-gray-400 text-lg">
							All buses for today have departed. Check back tomorrow for new
							schedules.
						</p>
						<CreateBusDialog />
					</div>
				)}

				{/* No Buses in Category */}
				{!allCompleted && filteredBuses.length === 0 && (
					<div className="flex flex-col items-center justify-center py-24 space-y-4">
						<p className="text-xl font-semibold text-gray-400">
							No buses scheduled
						</p>
						<p className="text-sm text-gray-500">
							No buses found for {selectedCategory}
						</p>
						<CreateBusDialog />
					</div>
				)}

				{/* Upcoming Buses Grid */}
				{upcomingBuses.length > 0 && (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{upcomingBuses.map((bus) => (
							<BusCard key={bus.id} bus={bus} />
						))}
					</div>
				)}

				{/* Completed Buses (Hidden when all completed) */}
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
