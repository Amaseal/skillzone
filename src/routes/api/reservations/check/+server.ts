import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reservations } from '$lib/server/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestHandler } from './$types';

import { getWorkingHours } from '$lib/server/settings';

export const GET: RequestHandler = async ({ url }) => {
	const date = url.searchParams.get('date');

	if (!date) {
		return json({ error: 'Date is required' }, { status: 400 });
	}

	try {
		const { start, end } = await getWorkingHours();

		// Generate time slots based on settings
		const timeSlots: string[] = [];
		const startHour = parseInt(start.split(':')[0]);
		const endHour = parseInt(end.split(':')[0]);

		for (let h = startHour; h < endHour; h++) {
			timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
		}

		console.log(`[CheckAPI] Checking for date: ${date}`);
		const result = await db
			.select({
				time: reservations.time,
				zones: reservations.zones,
				duration: reservations.duration
			})
			.from(reservations)
			.where(and(eq(reservations.date, date), ne(reservations.status, 'cancelled')));

		console.log(`[CheckAPI] Found ${result.length} reservations`);

		// Aggregate zones per time slot
		const availability: Record<string, number[]> = {};

		for (const row of result) {
			const startIndex = timeSlots.indexOf(row.time);
			if (startIndex === -1) {
				console.warn(`[CheckAPI] Time ${row.time} not found in slots`);
				continue;
			}

			const dur = row.duration || 1;
			console.log(
				`[CheckAPI] Processing: ${row.time} (${dur}h) Zones: ${JSON.stringify(row.zones)}`
			);

			// Mark zones as booked for each slot in the duration
			for (let i = 0; i < dur; i++) {
				const slotIndex = startIndex + i;
				if (slotIndex >= timeSlots.length) break;

				const timeSlot = timeSlots[slotIndex];
				if (!availability[timeSlot]) {
					availability[timeSlot] = [];
				}

				// Ensure zones is an array
				const z = Array.isArray(row.zones) ? row.zones : [];
				availability[timeSlot].push(...z);
			}
		}

		console.log(`[CheckAPI] Final Availability:`, JSON.stringify(availability));

		return json({ availability, workingHours: { start, end } });
	} catch (err: any) {
		console.error('Availability check error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
