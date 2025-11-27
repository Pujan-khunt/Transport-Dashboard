import { asc } from "drizzle-orm";
import { Suspense } from "react";
import { auth } from "@/auth/next-auth";
import { db } from "@/db/index";
import { type Bus, bus } from "@/db/schema/bus";
import { PublicDashboardClient } from "./PublicDashboardClient";

export default async function PublicDashboardPage() {
	const buses: Bus[] = await db
		.select()
		.from(bus)
		.orderBy(asc(bus.departureTime));

	const session = await auth();
	const isAdmin = session?.user.isAdmin;

	return (
		<Suspense>
			<PublicDashboardClient isAdmin={isAdmin ?? false} initialBuses={buses} />
		</Suspense>
	);
}
