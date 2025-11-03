import { defineConfig } from "drizzle-kit";

if (!process.env.DATBASE_URL) {
	throw new Error("DATABASE_URL must be present.");
}

export default defineConfig({
	schema: "./schema.ts",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
