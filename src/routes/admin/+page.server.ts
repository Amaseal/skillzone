import { db } from '$lib/server/db';
import { reservations } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('admin_session');
	if (session !== 'true') {
		throw redirect(303, '/admin/login');
	}

	const allReservations = await db
		.select()
		.from(reservations)
		.orderBy(desc(reservations.createdAt));

	return {
		reservations: allReservations
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('admin_session', { path: '/' });
		throw redirect(303, '/admin/login');
	},

	delete: async ({ request, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'true') {
			throw redirect(303, '/admin/login');
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		await db.delete(reservations).where(eq(reservations.id, id));

		return { success: true };
	}
};
