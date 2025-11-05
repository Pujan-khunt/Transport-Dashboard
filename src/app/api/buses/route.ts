import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/next-auth";
import { db } from "@/db";
import { bus, NewBus } from "@/db/schema/bus";

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
		console.error("Error creating bus:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
