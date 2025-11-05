"use client";

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
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
	const router = useRouter();
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
			setFormData({
				origin: "",
				destination: "",
				specialDestination: "",
				departureTime: "",
				isPaid: true,
			});
			setSelectedStatus("On Time");
			setCustomStatus("");
			setOpen(false);
			router.refresh();
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700">
					<Plus className="h-5 w-5" />
					Add New Bus
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Bus Schedule</DialogTitle>
						<DialogDescription>
							Create a new bus entry for today. All buses are scheduled for the
							current date.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						{/* Origin Dropdown */}
						<div className="grid gap-2">
							<Label htmlFor="origin">Source</Label>
							<Select
								value={formData.origin}
								onValueChange={(value: Location) =>
									setFormData({ ...formData, origin: value })
								}
							>
								<SelectTrigger id="origin">
									<SelectValue placeholder="Select source location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Uniworld-1">Uniworld 1</SelectItem>
									<SelectItem value="Uniworld-2">Uniworld 2</SelectItem>
									<SelectItem value="Macro">Macro</SelectItem>
									<SelectItem value="Special">Special</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Destination Dropdown */}
						<div className="grid gap-2">
							<Label htmlFor="destination">Destination</Label>
							<Select
								value={formData.destination}
								onValueChange={(value: Location) =>
									setFormData({ ...formData, destination: value })
								}
							>
								<SelectTrigger id="destination">
									<SelectValue placeholder="Select destination location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Uniworld-1">Uniworld 1</SelectItem>
									<SelectItem value="Uniworld-2">Uniworld 2</SelectItem>
									<SelectItem value="Macro">Macro</SelectItem>
									<SelectItem value="Special">Special</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Special Destination Input (Conditional) */}
						{showSpecialDestination && (
							<div className="grid gap-2">
								<Label htmlFor="specialDestination">
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
								/>
								<p className="text-xs text-muted-foreground">
									Enter the specific location for the special route
								</p>
							</div>
						)}

						{/* Departure Time */}
						<div className="grid gap-2">
							<Label htmlFor="departureTime">Departure Time (Today)</Label>
							<Input
								id="departureTime"
								type="time"
								value={formData.departureTime}
								onChange={(e) =>
									setFormData({ ...formData, departureTime: e.target.value })
								}
								required
							/>
							<p className="text-xs text-muted-foreground">
								Bus will be scheduled for today at the selected time
							</p>
						</div>

						{/* Type (Paid/Free) */}
						<div className="grid gap-2">
							<Label htmlFor="isPaid">Type</Label>
							<Select
								value={formData.isPaid ? "paid" : "free"}
								onValueChange={(value) =>
									setFormData({ ...formData, isPaid: value === "paid" })
								}
							>
								<SelectTrigger id="isPaid">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="paid">Paid</SelectItem>
									<SelectItem value="free">Free</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Status Dropdown with Custom Option */}
						<div className="grid gap-2">
							<Label htmlFor="status">Status</Label>
							<Select value={selectedStatus} onValueChange={handleStatusChange}>
								<SelectTrigger
									id="status"
									className={cn(isCustomStatus && "border-purple-500")}
								>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
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
								<Label htmlFor="customStatus">
									Custom Status{" "}
									<span className="text-purple-500 text-xs">(Required)</span>
								</Label>
								<Input
									id="customStatus"
									placeholder="e.g., Waiting for driver, Boarding, etc."
									value={customStatus}
									onChange={(e) => setCustomStatus(e.target.value)}
									className="border-purple-500 focus-visible:ring-purple-500"
									autoFocus
									required={isCustomStatus}
								/>
								<p className="text-xs text-muted-foreground">
									Enter any custom status message you want to display
								</p>
								{customStatus && (
									<div className="mt-1 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-md">
										<p className="text-xs text-muted-foreground mb-1">
											Preview:
										</p>
										<div className="inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium bg-blue-500/10 text-blue-500 border-blue-500/20">
											{customStatus}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								setSelectedStatus("On Time");
								setCustomStatus("");
							}}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || (isCustomStatus && !customStatus.trim())}
							className="bg-purple-600 hover:bg-purple-700"
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
