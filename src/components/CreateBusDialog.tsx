"use client";

import { ArrowUpDown, Loader2, Plus } from "lucide-react";
import { useState } from "react";
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
// import { useRouter } from "next/navigation"; // Removed to prevent potential build errors
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
	// const router = useRouter(); // Removed
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string>("On Time");
	const [customStatus, setCustomStatus] = useState("");
	const [formData, setFormData] = useState({
		origin: "" as Location | "",
		destination: "" as Location | "",
		specialDestination: "",
		departureTime: "",
		isPaid: true,
	});

	const showSpecialDestination =
		formData.origin === "Special" || formData.destination === "Special";

	const isCustomStatus = selectedStatus === "custom";
	const finalStatus = isCustomStatus ? customStatus : selectedStatus;

	const switchLocations = () => {
		setFormData({
			...formData,
			origin: formData.destination,
			destination: formData.origin,
		});
	};

	const resetForm = () => {
		setFormData({
			origin: "",
			destination: "",
			specialDestination: "",
			departureTime: "",
			isPaid: true,
		});
		setSelectedStatus("On Time");
		setCustomStatus("");
		setIsLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validate special destination if Special is selected
			if (showSpecialDestination && !formData.specialDestination.trim()) {
				alert("Please enter the special destination location");
				setIsLoading(false);
				return;
			}

			// Validate custom status
			if (isCustomStatus && !customStatus.trim()) {
				alert("Please enter a custom status");
				setIsLoading(false);
				return;
			}

			// Combine today's date with the selected time
			const today = new Date();
			const [hours, minutes] = formData.departureTime.split(":");
			today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

			const response = await fetch("/api/buses", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					origin: formData.origin,
					destination: formData.destination,
					specialDestination: showSpecialDestination
						? formData.specialDestination
						: null,
					departureTime: today.toISOString(),
					status: finalStatus,
					isPaid: formData.isPaid,
				}),
			});

			if (!response.ok) throw new Error("Failed to create bus");

			// Reset form and close dialog
			resetForm();
			setOpen(false);
			// router.refresh();
			window.location.reload(); // Use full page reload
		} catch (error) {
			console.error("Error creating bus:", error);
			alert("Failed to create bus. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
		// Clear custom status when switching away from custom
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
					resetForm(); // Reset form when dialog is closed
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
							Create a new bus entry for today. All buses are scheduled for the
							current date.
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
									className="bg-gray-600 rounded-full p-1"
								/>
							</div>
						</div>

						{/* Special Destination Input (Conditional) */}
						{showSpecialDestination && (
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
									required={showSpecialDestination}
									className="bg-gray-900 border-gray-700 text-white"
								/>
								<p className="text-xs text-gray-500">
									Enter the specific location for the special route
								</p>
							</div>
						)}

						{/* Departure Time */}
						<div className="grid gap-2">
							<Label htmlFor="departureTime" className="text-gray-300">
								Departure Time (Today)
							</Label>
							<Input
								id="departureTime"
								type="time"
								value={formData.departureTime}
								onChange={(e) =>
									setFormData({ ...formData, departureTime: e.target.value })
								}
								required
								className="bg-gray-900 border-gray-700 text-white"
							/>
							<p className="text-xs text-gray-500">
								Bus will be scheduled for today at the selected time
							</p>
						</div>

						{/* Type (Paid/Free) */}
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

						{/* Status Dropdown with Custom Option */}
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

						{/* Custom Status Input (Conditional) */}
						{isCustomStatus && (
							<div className="grid gap-2 animate-in slide-in-from-top-2 duration-200">
								<Label htmlFor="customStatus" className="text-gray-300">
									Custom Status{" "}
									<span className="text-purple-400 text-xs">(Required)</span>
								</Label>
								<Input
									id="customStatus"
									placeholder="e.g., Waiting for driver, Boarding, etc."
									value={customStatus}
									onChange={(e) => setCustomStatus(e.target.value)}
									className="border-purple-500 focus-visible:ring-purple-500 bg-gray-900 text-white"
									autoFocus
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
