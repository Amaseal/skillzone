import { db } from '$lib/server/db';
import { reservations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');

    if (sessionId) {
        try {
            // Delete the reservation associated with this cancelled session
            await db
                .delete(reservations)
                .where(eq(reservations.stripeSessionId, sessionId));
        } catch (err) {
            console.error('Error deleting cancelled reservation:', err);
        }
    }

    return {};
};
