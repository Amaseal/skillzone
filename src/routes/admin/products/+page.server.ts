import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('admin_session');
	if (session !== 'true') {
		throw redirect(303, '/admin/login');
	}

	const allProducts = await db.select().from(products).orderBy(products.sortOrder);

	return {
		products: allProducts
	};
};

export const actions: Actions = {
	update: async ({ request, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'true') {
			return fail(401, { error: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const pricePerZone = parseInt(data.get('pricePerZone') as string);
		const requiresTrainer = data.get('requiresTrainer') === 'true';
		const isWholeField = data.get('isWholeField') === 'true';
		const active = data.get('active') === 'true';

		if (!name || !pricePerZone) {
			return fail(400, { error: 'Name and price are required' });
		}

		await db
			.update(products)
			.set({
				name,
				description,
				pricePerZone,
				requiresTrainer,
				isWholeField,
				active
			})
			.where(eq(products.id, id));

		return { success: true };
	},

	create: async ({ request, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'true') {
			return fail(401, { error: 'Unauthorized' });
		}

		const data = await request.formData();
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const pricePerZone = parseInt(data.get('pricePerZone') as string);
		const requiresTrainer = data.get('requiresTrainer') === 'true';
		const isWholeField = data.get('isWholeField') === 'true';

		if (!name || !pricePerZone) {
			return fail(400, { error: 'Name and price are required' });
		}

		await db.insert(products).values({
			name,
			description,
			pricePerZone,
			requiresTrainer,
			isWholeField,
			active: true,
			sortOrder: 999
		});

		return { success: true };
	},

	delete: async ({ request, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'true') {
			return fail(401, { error: 'Unauthorized' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Invalid product ID' });
		}

		await db.delete(products).where(eq(products.id, id));

		return { success: true };
	}
};
