import { PublicDashboardClient } from "./public-dashboard-client";
import { db } from "@/db/index";
import { bus } from "@/db/schema/bus";
import { asc } from "drizzle-orm";

export default async function PublicDashboardPage() {
	const buses = await db.select().from(bus).orderBy(asc(bus.departureTime));

	return <PublicDashboardClient initialBuses={buses} />;
}
