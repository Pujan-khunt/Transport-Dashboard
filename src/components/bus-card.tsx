"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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

	return (
		<Card
			className={cn(
				"relative overflow-hidden bg-[#1a1a1a] border-gray-800 transition-all hover:border-gray-700",
				isCompleted && "opacity-40",
			)}
		>
			<div className="px-6 space-y-6">
				{/* Header: Route and Type Badge */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<span className="text-white font-medium text-lg truncate">
							{bus.origin}
						</span>
						<ArrowRight className="h-5 w-5 text-gray-500 shrink-0" />
						<span className="text-white font-medium text-lg truncate">
							{bus.destination}
						</span>
					</div>

					<Badge
						variant="secondary"
						className={cn(
							"text-xs font-semibold px-3 py-1 shrink-0",
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
					<p className="text-4xl font-bold text-white tabular-nums">
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

			{isCompleted && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
					<div className="text-white text-lg font-semibold px-6 py-2 bg-gray-800/90 rounded-full border border-gray-700">
						COMPLETED
					</div>
				</div>
			)}
		</Card>
	);
}
