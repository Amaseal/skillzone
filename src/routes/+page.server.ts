import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const activeProducts = await db
		.select()
		.from(products)
		.where(eq(products.active, true))
		.orderBy(products.sortOrder);

	return {
		products: activeProducts
	};
};
