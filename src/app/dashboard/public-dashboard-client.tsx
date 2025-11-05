"use client";

import { useState, useMemo } from "react";
import { PublicNavbar } from "@/components/public-navbar";
import { BusCard } from "@/components/bus-card";
import { CurrentTimeDisplay } from "@/components/current-time-display";
import { CheckCircle2 } from "lucide-react";
import type { Bus } from "@/db/schema/bus";

type Category = "uniworld-1" | "uniworld-2" | "special";

interface PublicDashboardClientProps {
	initialBuses: Bus[];
}

export function PublicDashboardClient({
	initialBuses,
}: PublicDashboardClientProps) {
	const [selectedCategory, setSelectedCategory] =
		useState<Category>("uniworld-1");

	const filteredBuses = useMemo(() => {
		return initialBuses.filter((bus) => {
			return bus.category === selectedCategory;
		});
	}, [initialBuses, selectedCategory]);

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
			<PublicNavbar
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>

			<main className="px-6 py-6">
				<div className="flex items-center justify-between mb-8">
					<CurrentTimeDisplay />
				</div>

				{allCompleted && (
					<div className="flex flex-col items-center justify-center py-24 space-y-4">
						<div className="rounded-full bg-green-500/10 p-6">
							<CheckCircle2 className="h-16 w-16 text-green-500" />
						</div>
						<h2 className="text-3xl font-bold text-white">
							All Buses Completed!
						</h2>
						<p className="text-gray-400 text-lg">
							All buses for today have departed. Check back tomorrow.
						</p>
					</div>
				)}

				{!allCompleted && filteredBuses.length === 0 && (
					<div className="flex flex-col items-center justify-center py-24">
						<p className="text-xl font-semibold text-gray-400">
							No buses scheduled
						</p>
					</div>
				)}

				{upcomingBuses.length > 0 && (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{upcomingBuses.map((bus) => (
							<BusCard key={bus.id} bus={bus} />
						))}
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
