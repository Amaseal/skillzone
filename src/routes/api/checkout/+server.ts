import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { reservations, products } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { eq, and, ne } from 'drizzle-orm';
import { getWorkingHours } from '$lib/server/settings';

export const POST: RequestHandler = async ({ request, url }) => {
    try {
        const { productId, date, time, duration = 1, name, email, zones, totalPrice } = await request.json();

        if (!productId) {
            return json({ error: 'Product ID is required' }, { status: 400 });
        }
        if (!date || !time || !name || !email || !zones || !Array.isArray(zones) || zones.length === 0) {
            return json({ error: 'Missing reservation details' }, { status: 400 });
        }
        if (!totalPrice || totalPrice <= 0) {
            return json({ error: 'Invalid price' }, { status: 400 });
        }
        if (!duration || duration < 1 || duration > 4) {
            return json({ error: 'Invalid duration (must be 1-4 hours)' }, { status: 400 });
        }

        // Validate working hours
        const { start, end } = await getWorkingHours();
        const reservationStart = parseInt(time.split(':')[0]);
        const openHour = parseInt(start.split(':')[0]);
        const closeHour = parseInt(end.split(':')[0]);

        // Check if start time is valid
        if (reservationStart < openHour || reservationStart >= closeHour) {
            return json({ error: `Rezervācijas iespējamas tikai darba laikā (${start}-${end})` }, { status: 400 });
        }

        // Check if end time exceeds working hours
        if (reservationStart + duration > closeHour) {
            return json({ error: `Rezervācijas laiks pārsniedz darba laiku (${start}-${end})` }, { status: 400 });
        }

        // Verify product exists
        const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
        if (!product || product.length === 0) {
            return json({ error: 'Product not found' }, { status: 404 });
        }

        // Helper function to get consecutive time slots
        const timeSlots = [
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
            '20:00', '21:00'
        ];

        const getConsecutiveSlots = (startTime: string, hours: number): string[] => {
            const startIndex = timeSlots.indexOf(startTime);
            if (startIndex === -1) return [];
            return timeSlots.slice(startIndex, startIndex + hours);
        };

        const consecutiveSlots = getConsecutiveSlots(time, duration);
        if (consecutiveSlots.length !== duration) {
            return json({ error: 'Not enough consecutive time slots available' }, { status: 400 });
        }

        // Check availability for all consecutive time slots
        for (const timeSlot of consecutiveSlots) {
            const conflict = await db.select().from(reservations).where(
                and(
                    eq(reservations.date, date),
                    eq(reservations.time, timeSlot),
                    ne(reservations.status, 'cancelled')
                )
            );

            const takenZones = conflict.flatMap(r => r.zones);
            const hasConflict = zones.some(z => takenZones.includes(z));

            if (hasConflict) {
                return json({ error: `Selected zones are already booked for ${timeSlot}.` }, { status: 409 });
            }
        }

        // Create pending reservation
        const result = await db
            .insert(reservations)
            .values({
                name,
                email,
                date,
                time,
                duration,
                productId,
                totalPrice,
                zones,
                status: 'pending' // Initial status
            })
            .returning({ id: reservations.id });

        const reservationId = result[0].id;

        // Calculate end time for description
        const endTime = consecutiveSlots[consecutiveSlots.length - 1];
        const endHour = parseInt(endTime.split(':')[0]) + 1;
        const timeRange = duration > 1 ? `${time}-${endHour.toString().padStart(2, '0')}:00` : time;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: product[0].name,
                            description: `${date} @ ${timeRange} (${duration}h) - Zonas: ${zones.join(', ')}`
                        },
                        unit_amount: totalPrice // Already in cents
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Pass session_id
            cancel_url: `${url.origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                reservationId: reservationId.toString()
            },
            customer_email: email // Pre-fill email in Stripe
        });

        // Update reservation with session ID
        if (session.id) {
            await db.update(reservations)
                .set({ stripeSessionId: session.id })
                .where(eq(reservations.id, reservationId));
        }

        if (!session.url) {
            return json({ error: 'Failed to create session URL' }, { status: 500 });
        }

        return json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return json({ error: err.message }, { status: 500 });
    }
};
