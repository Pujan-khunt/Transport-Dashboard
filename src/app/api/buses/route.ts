import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/next-auth";
import { db } from "@/db/index";
import { bus } from "@/db/schema/bus";

export async function POST(req: NextRequest) {
	try {
		// Check authentication
		const session = await auth();
		if (!session?.user.isAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse request body
		const body = await req.json();
		const { origin, destination, category, departureTime, status, isPaid } =
			body;

		// Validate required fields
		if (!origin || !destination || !category || !departureTime) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Insert into database
		const [newBus] = await db
			.insert(bus)
			.values({
				origin,
				destination,
				category,
				departureTime: new Date(departureTime),
				status: status || "On Time",
				isPaid: isPaid ?? true,
			})
			.returning();

		return NextResponse.json(newBus, { status: 201 });
	} catch (error) {
		console.error("Error creating bus:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
