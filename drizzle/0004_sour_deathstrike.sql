PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`duration` integer DEFAULT 1 NOT NULL,
	`product_id` integer NOT NULL,
	`total_price` integer NOT NULL,
	`zones` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`stripe_session_id` text,
	`created_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reservations`("id", "name", "email", "date", "time", "duration", "product_id", "total_price", "zones", "status", "stripe_session_id", "created_at") SELECT "id", "name", "email", "date", "time", "duration", "product_id", "total_price", "zones", "status", "stripe_session_id", "created_at" FROM `reservations`;--> statement-breakpoint
DROP TABLE `reservations`;--> statement-breakpoint
ALTER TABLE `__new_reservations` RENAME TO `reservations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_stripe_session_id_unique` ON `reservations` (`stripe_session_id`);