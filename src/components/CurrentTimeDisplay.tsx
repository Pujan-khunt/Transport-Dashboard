"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CurrentTimeDisplayProps {
	variant?: "default" | "compact";
	className?: string;
}

function CurrentTimeDisplay({
	variant = "default",
	className,
}: CurrentTimeDisplayProps) {
	const [mounted, setMounted] = useState(false);
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	// Update display time every minute.
	const updateDisplayTime = () => {
		setMounted(true);
		setCurrentTime(new Date());

		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	};

	// Run update timer function only once.
	useEffect(updateDisplayTime, []);

	// Render a loading state to prevent hydration mismatch
	if (!mounted || !currentTime) {
		const loadingCompact = (
			<div className={cn("text-left", className)}>
				<p className="text-lg font-bold tabular-nums text-white">--:-- --</p>
				<p className="text-sm text-gray-400">Loading...</p>
			</div>
		);
		const loadingDefault = (
			<div className={cn("flex items-center gap-2 text-right", className)}>
				<div>
					<p className="text-2xl font-bold tabular-nums">--:-- --</p>
					<p className="text-xs text-gray-400">Loading...</p>
				</div>
			</div>
		);
		return variant === "compact" ? loadingCompact : loadingDefault;
	}

	const timeString = currentTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	const dateString = currentTime.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

	// Compact variant to fit time and date above each other.
	if (variant === "compact") {
		return (
			<div className={cn("text-left", className)}>
				<p className="text-lg font-bold tabular-nums text-white">
					{timeString}
				</p>
				<p className="text-sm text-gray-400">{dateString}</p>
			</div>
		);
	}

	// Default variant with time and date on same line.
	return (
		<div
			className={cn(
				"text-white text-sm md:text-2xl flex lg:flex-row flex-col items-center gap-x-6",
				className,
			)}
		>
			<p>{dateString}</p>
			<p className="font-bold tabular-nums">{timeString}</p>
		</div>
	);
}

export default CurrentTimeDisplay;
