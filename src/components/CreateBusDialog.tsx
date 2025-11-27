"use client";

import { ArrowUpDown, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

const PRESET_STATUSES = [
	{ value: "On Time", label: "On Time" },
	{ value: "Delayed by 5 min", label: "Delayed by 5 min" },
	{ value: "Delayed by 10 min", label: "Delayed by 10 min" },
	{ value: "Delayed by 15 min", label: "Delayed by 15 min" },
	{ value: "Delayed by 20 min", label: "Delayed by 20 min" },
	{ value: "Cancelled", label: "Cancelled" },
	{ value: "custom", label: "Custom Status..." },
];

export function CreateBusDialog() {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string>("On Time");
	const [customStatus, setCustomStatus] = useState("");

	// Date state for special buses (YYYY-MM-DD)
	const [scheduleDate, setScheduleDate] = useState("");

	const [formData, setFormData] = useState({
		origin: "" as Location | "",
		destination: "" as Location | "",
		specialOrigin: "",
		specialDestination: "",
		departureTime: "",
		isPaid: true,
	});

	const [time, setTime] = useState({
		hour: "12",
		minute: "00",
		period: "AM",
	});

	// Initialize date on mount
	useEffect(() => {
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		setScheduleDate(`${yyyy}-${mm}-${dd}`);
	}, []);

	useEffect(() => {
		let h = parseInt(time.hour, 10);
		if (time.period === "PM" && h < 12) h += 12;
		if (time.period === "AM" && h === 12) h = 0;
		const timeString = `${h.toString().padStart(2, "0")}:${time.minute}`;
		setFormData((prev) => ({ ...prev, departureTime: timeString }));
	}, [time]);

	const isSpecialOrigin = formData.origin === "Special";
	const isSpecialDestination = formData.destination === "Special";
	// If either is special, we show the date picker
	const showDatePicker = isSpecialOrigin || isSpecialDestination;

	const isCustomStatus = selectedStatus === "custom";
	const finalStatus = isCustomStatus ? customStatus : selectedStatus;

	const switchLocations = () => {
		setFormData({
			...formData,
			origin: formData.destination,
			destination: formData.origin,
			// Swap special text as well if needed, though usually cleared
			specialOrigin: formData.specialDestination,
			specialDestination: formData.specialOrigin,
		});
	};

	const resetForm = () => {
		setFormData({
			origin: "",
			destination: "",
			specialOrigin: "",
			specialDestination: "",
			departureTime: "",
			isPaid: true,
		});
		setTime({ hour: "12", minute: "00", period: "AM" });
		setSelectedStatus("On Time");
		setCustomStatus("");
		setIsLoading(false);

		// Reset date to today
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		setScheduleDate(`${yyyy}-${mm}-${dd}`);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validation
			if (isSpecialOrigin && !formData.specialOrigin.trim()) {
				alert("Please enter the special source location");
				setIsLoading(false);
				return;
			}
			if (isSpecialDestination && !formData.specialDestination.trim()) {
				alert("Please enter the special destination location");
				setIsLoading(false);
				return;
			}
			
			if (!(formData.origin === "Special" || formData.destination === "Special") && formData.origin === formData.destination) {
				alert("Source and destination cannot be the same");
				setIsLoading(false);
				return;
			}

			if (isCustomStatus && !customStatus.trim()) {
				alert("Please enter a custom status");
				setIsLoading(false);
				return;
			}

			// Construct Date
			let finalDate: Date;
			if (showDatePicker && scheduleDate) {
				// Use selected date
				finalDate = new Date(scheduleDate);
			} else {
				// Use today
				finalDate = new Date();
			}

			const [hours, minutes] = formData.departureTime.split(":");
			finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

			const response = await fetch("/api/buses", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: formData.origin,
					destination: formData.destination,
					specialOrigin: isSpecialOrigin ? formData.specialOrigin : null,
					specialDestination: isSpecialDestination
						? formData.specialDestination
						: null,
					departureTime: finalDate.toISOString(),
					status: finalStatus,
					isPaid: formData.isPaid,
				}),
			});

			if (!response.ok) throw new Error("Failed to create bus");

			resetForm();
			setOpen(false);
			window.location.reload();
		} catch (error) {
			console.error("Error creating bus:", error);
			alert("Failed to create bus. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
		if (value !== "custom") {
			setCustomStatus("");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					resetForm();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700">
					<Plus className="h-5 w-5" />
					Add New Bus
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gray-950 border-gray-800 text-white">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-white">
							Add New Bus Schedule
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Create a new bus entry.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						{/* Origin Dropdown */}
						<div className="grid gap-2">
							<Label htmlFor="origin" className="text-gray-300">
								Source
							</Label>
							<Select
								value={formData.origin}
								onValueChange={(value: Location) =>
									setFormData({ ...formData, origin: value })
								}
							>
								<SelectTrigger
									id="origin"
									className="bg-gray-900 min-w-32 border-gray-700 text-white"
								>
									<SelectValue placeholder="Select source location" />
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-700 text-white">
									<SelectItem value="Uniworld-1">Uniworld 1</SelectItem>
									<SelectItem value="Uniworld-2">Uniworld 2</SelectItem>
									<SelectItem value="Macro">Macro</SelectItem>
									<SelectItem value="Special">Special</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Special Origin Input */}
						{isSpecialOrigin && (
							<div className="grid gap-2">
								<Label htmlFor="specialOrigin" className="text-gray-300">
									Special Source Name
								</Label>
								<Input
									id="specialOrigin"
									placeholder="e.g., Airport, Railway Station"
									value={formData.specialOrigin}
									onChange={(e) =>
										setFormData({
											...formData,
											specialOrigin: e.target.value,
										})
									}
									required={isSpecialOrigin}
									className="bg-gray-900 border-gray-700 text-white"
								/>
							</div>
						)}

						{/* Destination Dropdown */}
						<div className="grid gap-2">
							<Label htmlFor="destination" className="text-gray-300">
								Destination
							</Label>
							<div className="flex gap-x-4 items-center">
								<Select
									value={formData.destination}
									onValueChange={(value: Location) =>
										setFormData({ ...formData, destination: value })
									}
								>
									<SelectTrigger
										id="destination"
										className="bg-gray-900 min-w-32 border-gray-700 text-white"
									>
										<SelectValue placeholder="Select destination location" />
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-700 text-white">
										<SelectItem value="Uniworld-1">Uniworld 1</SelectItem>
										<SelectItem value="Uniworld-2">Uniworld 2</SelectItem>
										<SelectItem value="Macro">Macro</SelectItem>
										<SelectItem value="Special">Special</SelectItem>
									</SelectContent>
								</Select>

								<ArrowUpDown
									onClick={switchLocations}
									className="bg-gray-600 rounded-full p-1 cursor-pointer hover:bg-gray-500"
								/>
							</div>
						</div>

						{/* Special Destination Input */}
						{isSpecialDestination && (
							<div className="grid gap-2">
								<Label htmlFor="specialDestination" className="text-gray-300">
									Special Destination Name
								</Label>
								<Input
									id="specialDestination"
									placeholder="e.g., Airport, Mall, etc."
									value={formData.specialDestination}
									onChange={(e) =>
										setFormData({
											...formData,
											specialDestination: e.target.value,
										})
									}
									required={isSpecialDestination}
									className="bg-gray-900 border-gray-700 text-white"
								/>
							</div>
						)}

						{/* Date Picker (Only if special) */}
						{showDatePicker && (
							<div className="grid gap-2">
								<Label htmlFor="date" className="text-gray-300">
									Date
								</Label>
								<Input
									type="date"
									id="date"
									value={scheduleDate}
									onChange={(e) => setScheduleDate(e.target.value)}
									className="bg-gray-900 border-gray-700 text-white scheme-dark"
									required
								/>
							</div>
						)}

						{/* Departure Time */}
						<div className="grid gap-2">
							<Label className="text-gray-300">
								Departure Time {showDatePicker ? "" : "(Today)"}
							</Label>
							<div className="flex gap-2 items-center">
								{/* Hour */}
								<Select
									value={time.hour}
									onValueChange={(v) => setTime({ ...time, hour: v })}
								>
									<SelectTrigger className="bg-gray-900 border-gray-700 text-white w-[70px]">
										<SelectValue placeholder="HH" />
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-700 text-white max-h-[200px]">
										{Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
											<SelectItem key={h} value={h.toString()}>
												{h.toString().padStart(2, "0")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<span className="text-white font-bold">:</span>

								{/* Minute */}
								<Select
									value={time.minute}
									onValueChange={(v) => setTime({ ...time, minute: v })}
								>
									<SelectTrigger className="bg-gray-900 border-gray-700 text-white w-[70px]">
										<SelectValue placeholder="MM" />
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-700 text-white max-h-[200px]">
										{Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
											<SelectItem key={m} value={m.toString().padStart(2, "0")}>
												{m.toString().padStart(2, "0")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{/* Period */}
								<Select
									value={time.period}
									onValueChange={(v) => setTime({ ...time, period: v })}
								>
									<SelectTrigger className="bg-gray-900 border-gray-700 text-white w-[70px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-700 text-white">
										<SelectItem value="AM">AM</SelectItem>
										<SelectItem value="PM">PM</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Type (Paid/Free) and Status... (Rest is largely same) */}
						<div className="grid gap-2">
							<Label htmlFor="isPaid" className="text-gray-300">
								Type
							</Label>
							<Select
								value={formData.isPaid ? "paid" : "free"}
								onValueChange={(value) =>
									setFormData({ ...formData, isPaid: value === "paid" })
								}
							>
								<SelectTrigger
									id="isPaid"
									className="bg-gray-900 border-gray-700 text-white"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-700 text-white">
									<SelectItem value="paid">Paid</SelectItem>
									<SelectItem value="free">Free</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Status */}
						<div className="grid gap-2">
							<Label htmlFor="status" className="text-gray-300">
								Status
							</Label>
							<Select value={selectedStatus} onValueChange={handleStatusChange}>
								<SelectTrigger
									id="status"
									className={cn(
										isCustomStatus && "border-purple-500",
										"bg-gray-900 border-gray-700 text-white",
									)}
								>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-700 text-white">
									{PRESET_STATUSES.map((status) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Custom Status */}
						{isCustomStatus && (
							<div className="grid gap-2 animate-in slide-in-from-top-2 duration-200">
								<Label htmlFor="customStatus" className="text-gray-300">
									Custom Status{" "}
									<span className="text-purple-400 text-xs">(Required)</span>
								</Label>
								<Input
									id="customStatus"
									placeholder="e.g., Waiting for driver"
									value={customStatus}
									onChange={(e) => setCustomStatus(e.target.value)}
									className="border-purple-500 focus-visible:ring-purple-500 bg-gray-900 text-white"
									required={isCustomStatus}
								/>
							</div>
						)}
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
							className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || (isCustomStatus && !customStatus.trim())}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Create Bus
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
