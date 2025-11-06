import { asc } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db/index";
import { type Bus, bus } from "@/db/schema/bus";
import { PublicDashboardClient } from "./PublicDashboardClient";

export default async function PublicDashboardPage() {
	const buses: Bus[] = await db
		.select()
		.from(bus)
		.orderBy(asc(bus.departureTime));

	return (
		<Suspense>
			<PublicDashboardClient initialBuses={buses} />
		</Suspense>
	);
}
