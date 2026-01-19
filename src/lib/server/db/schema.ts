import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	age: integer('age')
});

export const products = sqliteTable('products', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	pricePerZone: integer('price_per_zone').notNull(), // Price in cents (e.g., 1500 for 15 EUR)
	requiresTrainer: integer('requires_trainer', { mode: 'boolean' }).notNull().default(false),
	isWholeField: integer('is_whole_field', { mode: 'boolean' }).notNull().default(false),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const reservations = sqliteTable('reservations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	date: text('date').notNull(), // ISO YYYY-MM-DD
	time: text('time').notNull(), // e.g. "14:00"
	duration: integer('duration').notNull().default(1), // Number of consecutive hours (1, 2, 3, etc.)
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }), // References products.id
	totalPrice: integer('total_price').notNull(), // Calculated total in cents
	zones: text('zones', { mode: 'json' }).$type<number[]>().notNull().default([]), // Array of zone IDs [1..8]
	status: text('status', { enum: ['pending', 'paid', 'cancelled'] })
		.default('pending')
		.notNull(),
	stripeSessionId: text('stripe_session_id').unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const settings = sqliteTable('settings', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	key: text('key').notNull().unique(), // e.g., 'opening_hour', 'closing_hour', 'admin_email'
	value: text('value').notNull() // e.g., '08:00', '21:00', 'admin@example.com'
});
