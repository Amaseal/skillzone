CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price_per_zone` integer NOT NULL,
	`requires_trainer` integer DEFAULT false NOT NULL,
	`is_whole_field` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
ALTER TABLE `reservations` ADD `product_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `total_price` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` DROP COLUMN `price_id`;--> statement-breakpoint
ALTER TABLE `reservations` DROP COLUMN `product_name`;