import { asc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/next-auth";
import { db } from "@/db";
import { type Bus, bus } from "@/db/schema/bus";

export async function GET(_req: NextRequest) {
	try {
		const buses: Bus[] = await db
			.select()
			.from(bus)
			.orderBy(asc(bus.departureTime));

		return NextResponse.json(buses, { status: 200 });
	} catch (error) {
		console.error("Error fetching buses:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user.isAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { busId } = await req.json();
		if (!busId) {
			return NextResponse.json({ error: "Missing busId" }, { status: 400 });
		}

		const [deletedBus] = await db.delete(bus).where(eq(bus.id, busId));
		if (!deletedBus) {
			return NextResponse.json({ message: "Bus not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Bus deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error deleting bus:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user.isAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const {
			origin,
			destination,
			specialDestination,
			departureTime,
			status,
			isPaid,
			busId,
		} = body;

		if (!origin || !destination || !departureTime || !busId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const [updatedBus] = await db
			.update(bus)
			.set({
				origin,
				destination,
				specialDestination: specialDestination || null,
				departureTime: new Date(departureTime),
				status: status || "On Time",
				isPaid: isPaid ?? true,
			})
			.where(eq(bus.id, busId))
			.returning();

		if (!updatedBus) {
			return NextResponse.json({ error: "Bus not found" }, { status: 404 });
		}

		return NextResponse.json(updatedBus, { status: 200 });
	} catch (error) {
		console.error("Error updating bus:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user.isAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const {
			origin,
			destination,
			specialDestination,
			departureTime,
			status,
			isPaid,
		} = body;

		if (!origin || !destination || !departureTime) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const [newBus] = await db
			.insert(bus)
			.values({
				origin,
				destination,
				specialDestination: specialDestination || null,
				departureTime: new Date(departureTime),
				status: status || "On Time",
				isPaid: isPaid ?? true,
			})
			.returning();

		return NextResponse.json(newBus, { status: 201 });
	} catch (error) {
		console.error("Error inserting bus:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
