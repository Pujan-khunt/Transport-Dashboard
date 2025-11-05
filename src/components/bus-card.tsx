"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bus } from "@/db/schema/bus";

interface BusCardProps {
	bus: Bus;
	isCompleted?: boolean;
}

const getStatusStyle = (status: string) => {
	const statusLower = status.toLowerCase();
	if (statusLower.includes("on time")) {
		return {
			bg: "bg-green-500/10",
			text: "text-green-500",
			border: "border-green-500/20",
		};
	}
	if (statusLower.includes("delayed")) {
		return {
			bg: "bg-yellow-500/10",
			text: "text-yellow-500",
			border: "border-yellow-500/20",
		};
	}
	if (statusLower.includes("cancelled")) {
		return {
			bg: "bg-red-500/10",
			text: "text-red-500",
			border: "border-red-500/20",
		};
	}
	return {
		bg: "bg-blue-500/10",
		text: "text-blue-500",
		border: "border-blue-500/20",
	};
};

export function BusCard({ bus, isCompleted }: BusCardProps) {
	const departureTime = new Date(bus.departureTime);
	const timeString = departureTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	const statusStyle = getStatusStyle(bus.status);

	// Display special destination if it exists
	const displayDestination =
		bus.destination === "Special" && bus.specialDestination
			? bus.specialDestination
			: bus.destination;

	const displayOrigin =
		bus.origin === "Special" && bus.specialDestination
			? bus.specialDestination
			: bus.origin;

	return (
		<Card
			className={cn(
				"relative overflow-hidden bg-[#1a1a1a] border-gray-800 transition-all hover:border-gray-700",
				isCompleted && "opacity-55 border-gray-700/40",
			)}
		>
			<div className="px-6 space-y-6">
				{/* Completed Badge at Top Right */}
				{isCompleted && (
					<div className="absolute top-3 right-3">
						<div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800/90 rounded-full border border-gray-700">
							<CheckCircle className="h-3.5 w-3.5 text-gray-400" />
							<span className="text-xs font-medium text-gray-400">
								Completed
							</span>
						</div>
					</div>
				)}

				{/* Header: Route and Type Badge */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 min-w-0">
						<span className="text-white font-medium text-xl truncate">
							{displayOrigin}
						</span>
						<ArrowRight className="h-5 w-5 text-gray-500 shrink-0" />
						<span className="text-white font-medium text-xl truncate">
							{displayDestination}
						</span>
					</div>

					<Badge
						variant="secondary"
						className={cn(
							"text-xs font-semibold px-3 py-1 shrink-0 absolute bottom-3 right-3",
							bus.isPaid
								? "bg-white text-black hover:bg-gray-100"
								: "bg-white text-black hover:bg-gray-100",
						)}
					>
						{bus.isPaid ? "Paid" : "Free"}
					</Badge>
				</div>

				{/* Departure Time */}
				<div>
					<p
						className={cn(
							"text-5xl font-bold tabular-nums",
							isCompleted ? "text-gray-500" : "text-white",
						)}
					>
						{timeString}
					</p>
				</div>

				{/* Status */}
				<div
					className={cn(
						"inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium",
						statusStyle.bg,
						statusStyle.text,
						statusStyle.border,
					)}
				>
					{bus.status}
				</div>
			</div>
		</Card>
	);
}
