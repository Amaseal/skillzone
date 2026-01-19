import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from './src/lib/server/db/schema.ts';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });
const { reservations, settings } = schema;

async function main() {
	console.log('--- Settings ---');
	const allSettings = await db.select().from(settings);
	console.table(allSettings);

	console.log('\n--- Reservations ---');
	const allReservations = await db.select().from(reservations);
	console.table(allReservations);

	// Simulate server logic
	const date = '2026-01-17';
	console.log(`\n--- Simulating Check for ${date} ---`);

	// Default settings
	const start = '08:00';
	const end = '21:00';
	console.log(`Settings: ${start} - ${end}`);

	const timeSlots = [];
	const startHour = parseInt(start.split(':')[0]);
	const endHour = parseInt(end.split(':')[0]);

	for (let h = startHour; h < endHour; h++) {
		timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
	}
	console.log('TimeSlots:', timeSlots);

	const result = await db
		.select({
			time: reservations.time,
			zones: reservations.zones,
			duration: reservations.duration
		})
		.from(reservations)
		.where(eq(reservations.date, date));

	console.log('Found reservations:', result);

	const availability = {};

	for (const row of result) {
		const startIndex = timeSlots.indexOf(row.time);
		if (startIndex === -1) continue;

		console.log(`Processing reservation at ${row.time} with duration ${row.duration}`);

		for (let i = 0; i < (row.duration || 1); i++) {
			const slotIndex = startIndex + i;
			if (slotIndex >= timeSlots.length) break;

			const timeSlot = timeSlots[slotIndex];
			if (!availability[timeSlot]) {
				availability[timeSlot] = [];
			}
			// Drizzle sqlite buffer issue?
			// If zones is buffer/string, we need to parse it?
			// But output said [1, 5]
			availability[timeSlot].push(...row.zones);
		}
	}

	console.log('\nCalculated Availability:');
	console.dir(availability, { depth: null });
}

main().catch(console.error);
