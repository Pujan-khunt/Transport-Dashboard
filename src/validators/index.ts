import { z } from "zod";

export const newBusSchema = z.object({
	origin: z.string().min(3),
	destination: z.string().min(3),
	category: z.enum(["uniworld-1", "uniworld-2", "special"]),
	departureTime: z.coerce.date(), // handles string -> Date conversion
	status: z.string().optional().default("On Time"),
	isPaid: z.boolean().optional().default(true),
});

export const busSchema = newBusSchema.extend({
	id: z.number().int(),
	createdAt: z.coerce.date(),
	modifiedAt: z.coerce.date(),
});

export type NewBusInput = z.infer<typeof newBusSchema>;
export type BusValidated = z.infer<typeof busSchema>;
