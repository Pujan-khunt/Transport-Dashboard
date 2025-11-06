import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth/next-auth";
import { db } from "@/db/index";
import { type Bus, bus } from "@/db/schema/bus";
import { AdminDashboardClient } from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
	const session = await auth();

	// Protect route
	if (!session?.user.isAdmin) {
		redirect("/auth/signin");
	}

	// Fetch all buses from database
	const buses: Bus[] = await db
		.select()
		.from(bus)
		.orderBy(asc(bus.departureTime));
	console.log(buses);

	return (
		<AdminDashboardClient
			user={{
				name: session.user.name,
				email: session.user.email,
				image: session.user.image,
			}}
			initialBuses={buses}
		/>
	);
}
