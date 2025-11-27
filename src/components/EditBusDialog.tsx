"use client";

import { AlertTriangle, ArrowUpDown, Loader2, Save, Trash } from "lucide-react";
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
import type { Bus } from "@/db/schema/bus";
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

const formatTime = (isoDate: string | Date) => {
	const date = new Date(isoDate);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

const formatDate = (isoDate: string | Date) => {
	const date = new Date(isoDate);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
};

const isPresetStatus = (status: string) => {
	return PRESET_STATUSES.some((s) => s.value === status);
};

interface EditBusDialogProps {
	bus: Bus;
	children: React.ReactNode;
}

export function EditBusDialog({ bus, children }: EditBusDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const initialStatus = isPresetStatus(bus.status) ? bus.status : "custom";
	const initialCustomStatus = isPresetStatus(bus.status) ? "" : bus.status;

	const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
	const [customStatus, setCustomStatus] = useState(initialCustomStatus);

	// Date state
	const [scheduleDate, setScheduleDate] = useState(
		formatDate(bus.departureTime),
	);

	const [formData, setFormData] = useState({
		origin: bus.origin as Location,
		destination: bus.destination as Location,
		specialOrigin: bus.specialOrigin || "",
		specialDestination: bus.specialDestination || "",
		departureTime: formatTime(bus.departureTime),
		isPaid: bus.isPaid,
	});

	const [time, setTime] = useState({
		hour: "12",
		minute: "00",
		period: "AM",
	});

	useEffect(() => {
		let h = parseInt(time.hour, 10);
		if (time.period === "PM" && h < 12) h += 12;
		if (time.period === "AM" && h === 12) h = 0;
		const timeString = `${h.toString().padStart(2, "0")}:${time.minute}`;
		setFormData((prev) => ({ ...prev, departureTime: timeString }));
	}, [time]);

	const isSpecialOrigin = formData.origin === "Special";
	const isSpecialDestination = formData.destination === "Special";
	const showDatePicker = isSpecialOrigin || isSpecialDestination;

	const isCustomStatus = selectedStatus === "custom";
	const finalStatus = isCustomStatus ? customStatus : selectedStatus;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
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

			let finalDate: Date;
			if (showDatePicker && scheduleDate) {
				finalDate = new Date(scheduleDate);
			} else {
				// If not special, try to keep existing date if possible, or fallback to today.
				// However, user usually edits buses for upcoming schedules.
				// Safest to rely on the existing departureTime date object for non-special changes
				// unless they explicitly toggled special which forces date input.
				finalDate = new Date(bus.departureTime);
			}

			const [hours, minutes] = formData.departureTime.split(":");
			finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

			const response = await fetch("/api/buses", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					busId: bus.id,
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

			if (!response.ok) throw new Error("Failed to update bus");

			setOpen(false);
			window.location.reload();
		} catch (error) {
			console.error("Error updating bus:", error);
			alert("Failed to update bus. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch("/api/buses", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ busId: bus.id }),
			});

			if (!response.ok) throw new Error("Failed to delete bus");

			setOpen(false);
			window.location.reload();
		} catch (error) {
			console.error("Error deleting bus:", error);
			alert("Failed to delete bus. Please try again.");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
		if (value !== "custom") {
			setCustomStatus("");
		}
	};

	const onOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			setFormData({
				origin: bus.origin as Location,
				destination: bus.destination as Location,
				specialOrigin: bus.specialOrigin || "",
				specialDestination: bus.specialDestination || "",
				departureTime: formatTime(bus.departureTime),
				isPaid: bus.isPaid,
			});
			setScheduleDate(formatDate(bus.departureTime));

			const date = new Date(bus.departureTime);
			let hours = date.getHours();
			const minutes = date.getMinutes().toString().padStart(2, "0");
			const period = hours >= 12 ? "PM" : "AM";
			if (hours > 12) hours -= 12;
			if (hours === 0) hours = 12;
			setTime({ hour: hours.toString(), minute: minutes, period });

			setSelectedStatus(initialStatus);
			setCustomStatus(initialCustomStatus);
			setShowDeleteConfirm(false);
			setIsLoading(false);
			setIsDeleting(false);
		}
	};

	const switchLocations = () => {
		setFormData({
			...formData,
			origin: formData.destination,
			destination: formData.origin,
			specialOrigin: formData.specialDestination,
			specialDestination: formData.specialOrigin,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gray-950 border-gray-800 text-white">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-white">Edit Bus Schedule</DialogTitle>
						<DialogDescription className="text-gray-400">
							Update the details for this bus.
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
									Special Destination Location
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
							<Label className="text-gray-300">Departure Time</Label>
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

						{/* Type and Status sections remain unchanged... */}
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
									autoFocus
									required={isCustomStatus}
								/>
							</div>
						)}
					</div>

					<DialogFooter className="gap-2 sm:justify-between">
						{/* ... Footer logic remains largely the same ... */}
						{!showDeleteConfirm ? (
							<Button
								type="button"
								variant="destructive"
								className="mr-auto"
								onClick={() => setShowDeleteConfirm(true)}
								disabled={isLoading || isDeleting}
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</Button>
						) : (
							<div className="flex gap-2 mr-auto animate-in fade-in-0 duration-200">
								<Button
									type="button"
									variant="destructive"
									onClick={handleDelete}
									disabled={isDeleting}
								>
									{isDeleting ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<AlertTriangle className="mr-2 h-4 w-4" />
									)}
									Confirm Delete
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="text-gray-300 hover:text-white"
									onClick={() => setShowDeleteConfirm(false)}
									disabled={isDeleting}
								>
									Cancel
								</Button>
							</div>
						)}

						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isLoading || isDeleting}
								className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									isLoading ||
									isDeleting ||
									(isCustomStatus && !customStatus.trim())
								}
								className="bg-purple-600 hover:bg-purple-700 text-white"
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Save Changes
									</>
								)}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
