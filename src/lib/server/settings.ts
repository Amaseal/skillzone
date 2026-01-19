import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string, defaultValue: string): Promise<string> {
	const result = await db.select().from(settings).where(eq(settings.key, key));
	if (result.length > 0) {
		return result[0].value;
	}
	return defaultValue;
}

export async function setSetting(key: string, value: string): Promise<void> {
	const existing = await db.select().from(settings).where(eq(settings.key, key));
	if (existing.length > 0) {
		await db.update(settings).set({ value }).where(eq(settings.key, key));
	} else {
		await db.insert(settings).values({ key, value });
	}
}

export async function getWorkingHours() {
	return {
		start: await getSetting('opening_hour', '08:00'),
		end: await getSetting('closing_hour', '21:00')
	};
}
