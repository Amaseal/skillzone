import { db } from './src/lib/server/db/index.js';
import { products } from './src/lib/server/db/schema.js';

async function seed() {
	console.log('Seeding products...');

	await db.insert(products).values([
		{
			name: 'Viena zona',
			description: 'Atsevišķi nodalīta treniņu zona ar visu inventāru',
			pricePerZone: 1500, // 15 EUR in cents
			requiresTrainer: false,
			isWholeField: false,
			active: true,
			sortOrder: 1
		},
		{
			name: 'Viena zona ar treneri',
			description: 'Individuāls treniņš ar treneri, laukuma izmērs pēc trenera vajadzībām',
			pricePerZone: 3500, // 35 EUR in cents
			requiresTrainer: true,
			isWholeField: false,
			active: true,
			sortOrder: 2
		},
		{
			name: 'Viss laukums ar treneri',
			description: 'Pilnais laukums ar treneri un visu inventāru',
			pricePerZone: 12000, // 120 EUR total (fixed price)
			requiresTrainer: true,
			isWholeField: true,
			active: true,
			sortOrder: 3
		}
	]);

	console.log('Products seeded successfully!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('Error seeding products:', err);
	process.exit(1);
});
