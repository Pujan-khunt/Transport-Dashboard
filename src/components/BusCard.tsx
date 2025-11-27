"use client";

import { ArrowRight, CheckCircle, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Bus } from "@/db/schema/bus";
import { cn } from "@/lib/utils";
import { EditBusDialog } from "./EditBusDialog";

interface BusCardProps {
	bus: Bus;
	isCompleted?: boolean;
	isAdminView?: boolean;
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

export function BusCard({ bus, isCompleted, isAdminView }: BusCardProps) {
	const departureTime = new Date(bus.departureTime);
	
    // Format Time: "10:30 AM"
    const timeString = departureTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

    // Format Date: "Mon, Nov 14"
    const dateString = departureTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

	const statusStyle = getStatusStyle(bus.status);

	const displayDestination =
		bus.destination === "Special" && bus.specialDestination
			? bus.specialDestination
			: bus.destination;

	const displayOrigin =
		bus.origin === "Special" && bus.specialOrigin
			? bus.specialOrigin
			: bus.origin;

	return (
		<Card
			className={cn(
				"relative group overflow-hidden bg-[#1a1a1a] border-gray-300 transition-all hover:border-gray-700 h-full",
				isCompleted && "opacity-55 border-gray-700/40",
			)}
		>
			{/* Admin Edit Button */}
			{isAdminView && !isCompleted && (
				<EditBusDialog bus={bus}>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"absolute top-3 right-3 z-10 bg-gray-900/50 border-gray-700/60 text-gray-300",
						)}
					>
						<Pencil className="h-4 w-4 mr-2" />
						Edit
					</Button>
				</EditBusDialog>
			)}

			<div className="px-6 space-y-6 pb-6">
				{/* Completed Badge */}
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
				<div className="flex flex-col gap-3 pt-4">
					<div className="flex items-center gap-3 w-full">
						{/* Origin */}
                        <span className="text-white font-medium text-xl wrap-break-word w-1/2 leading-tight">
							{displayOrigin}
						</span>
						
                        {/* Arrow */}
                        <ArrowRight className="h-5 w-5 text-gray-500 shrink-0" />
						
                        {/* Destination */}
                        <span className="text-white font-medium text-xl warp-break-word w-1/2 text-right leading-tight">
							{displayDestination}
						</span>
					</div>

                    {/* Paid/Free Badge */}
                    <div className="flex justify-end">
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
				</div>

				{/* Departure Time & Date */}
				<div>
					<p
						className={cn(
							"text-5xl font-bold tabular-nums",
							isCompleted ? "text-gray-500" : "text-white",
						)}
					>
						{timeString}
					</p>
                    {/* Added Date Display */}
                    <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wide">
                        {dateString}
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