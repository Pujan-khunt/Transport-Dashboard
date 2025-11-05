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

export function CreateBusDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		origin: "",
		destination: "",
		category: "uniworld-1" as "uniworld-1" | "uniworld-2" | "special",
		departureTime: "", // Time only (HH:MM)
		status: "On Time",
		isPaid: true,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Combine today's date with the selected time
			const today = new Date();
			const [hours, minutes] = formData.departureTime.split(":");
			today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

			const response = await fetch("/api/buses", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					departureTime: today.toISOString(),
				}),
			});

			if (!response.ok) throw new Error("Failed to create bus");

			// Reset form and close dialog
			setFormData({
				origin: "",
				destination: "",
				category: "uniworld-1",
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
				<Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700">
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
						<div className="grid gap-2">
							<Label htmlFor="origin">Source</Label>
							<Input
								id="origin"
								placeholder="e.g., Uniworld 1"
								value={formData.origin}
								onChange={(e) =>
									setFormData({ ...formData, origin: e.target.value })
								}
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="destination">Destination</Label>
							<Input
								id="destination"
								placeholder="e.g., Macro"
								value={formData.destination}
								onChange={(e) =>
									setFormData({ ...formData, destination: e.target.value })
								}
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="category">Category</Label>
							<Select
								value={formData.category}
								onValueChange={(value: any) =>
									setFormData({ ...formData, category: value })
								}
							>
								<SelectTrigger id="category">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="uniworld-1">Uniworld 1</SelectItem>
									<SelectItem value="uniworld-2">Uniworld 2</SelectItem>
									<SelectItem value="special">Special</SelectItem>
								</SelectContent>
							</Select>
						</div>

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

						<div className="grid gap-2">
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
