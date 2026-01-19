import { redirect } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { reservations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '$lib/server/email';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
        // If no session ID, just render the page (maybe they navigated here directly)
        // Or redirect to home? Let's just render.
        return {};
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Update reservation status
            const updated = await db
                .update(reservations)
                .set({ status: 'paid' })
                .where(eq(reservations.stripeSessionId, sessionId))
                .returning();

            if (updated.length > 0) {
                const r = updated[0];
                // Send email to admin
                // TODO: Make admin email configurable. For now using env var or hardcoded fallback
                const adminEmail = process.env.ADMIN_EMAIL || 'info@skillzone.lv';

                await sendEmail(
                    adminEmail,
                    `Jauna rezervācija: ${r.date} @ ${r.time}`,
                    `
                    <h1>Jauna rezervācija apmaksāta!</h1>
                    <p><strong>Klients:</strong> ${r.name} (${r.email})</p>
                    <p><strong>Datums:</strong> ${r.date}</p>
                    <p><strong>Laiks:</strong> ${r.time} (${r.duration}h)</p>
                    <p><strong>Zonas:</strong> ${r.zones.join(', ')}</p>
                    <p><strong>Cena:</strong> ${(r.totalPrice / 100).toFixed(2)} EUR</p>
                    `
                );
            }
        }
    } catch (err) {
        console.error('Error verifying session:', err);
    }

    return {};
};
