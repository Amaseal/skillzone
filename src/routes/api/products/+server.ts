import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const activeProducts = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.sortOrder);

    return json(activeProducts);
  } catch (err: any) {
    console.error('Products fetch error:', err);
    return json({ error: err.message }, { status: 500 });
  }
};