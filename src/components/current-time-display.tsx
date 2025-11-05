"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function CurrentTimeDisplay() {
	const [mounted, setMounted] = useState(false);
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		// Set mounted to true on client
		setMounted(true);
		setCurrentTime(new Date());

		// Update time every minute (no seconds needed)
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	// Prevent hydration mismatch by not rendering time on server
	if (!mounted || !currentTime) {
		return (
			<div className="flex items-center gap-2 text-right">
				<div>
					<p className="text-2xl font-bold tabular-nums">--:-- --</p>
					<p className="text-xs text-gray-400">Loading...</p>
				</div>
			</div>
		);
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

	return (
		<div className="flex items-center gap-2 text-right">
			<div>
				<Clock />
				<p className="text-2xl font-bold tabular-nums">{timeString}</p>
				<p className="text-xs text-gray-400">{dateString}</p>
			</div>
		</div>
	);
}
