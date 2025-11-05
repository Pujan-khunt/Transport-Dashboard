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

type Location = "Uniworld-1" | "Uniworld-2" | "Macro" | "Special";

export function CreateBusDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		origin: "" as Location | "",
		destination: "" as Location | "",
		specialDestination: "",
		departureTime: "",
		status: "On Time",
		isPaid: true,
	});

	const showSpecialDestination =
		formData.origin === "Special" || formData.destination === "Special";

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
					status: formData.status,
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
				status: "On Time",
				isPaid: true,
			});
			setOpen(false);
			router.refresh();
		} catch (error) {
			console.error("Error creating bus:", error);
			alert("Failed to create bus. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="lg"
					className="gap-2 md:w-full bg-purple-600 hover:bg-purple-700"
				>
					<Plus className="h-5 w-5" />
					Add New Bus
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
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
								<SelectTrigger className="w-full" id="origin">
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
								<SelectTrigger className="w-full" id="destination">
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

						<div className="flex gap-x-6">
							{/* Type (Paid/Free) */}
							<div className="gap-2 gap-x-6 md:flex-1 flex items-center">
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

							{/* Status */}
							<div className="gap-2 flex items-center">
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(value) =>
										setFormData({ ...formData, status: value })
									}
								>
									<SelectTrigger id="status">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="On Time">On Time</SelectItem>
										<SelectItem value="Delayed by 5 min">
											Delayed by 5 min
										</SelectItem>
										<SelectItem value="Delayed by 10 min">
											Delayed by 10 min
										</SelectItem>
										<SelectItem value="Delayed by 15 min">
											Delayed by 15 min
										</SelectItem>
										<SelectItem value="Cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Bus"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
