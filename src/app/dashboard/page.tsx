import { PublicDashboardClient } from "./public-dashboard-client";
import { db } from "@/db/index";
import { Bus, bus } from "@/db/schema/bus";
import { asc } from "drizzle-orm";

export default async function PublicDashboardPage() {
	const buses: Bus[] = await db
		.select()
		.from(bus)
		.orderBy(asc(bus.departureTime));

	return <PublicDashboardClient initialBuses={buses} />;
}
