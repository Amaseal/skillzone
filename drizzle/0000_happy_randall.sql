CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`price_id` text NOT NULL,
	`product_name` text,
	`zones` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`stripe_session_id` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_stripe_session_id_unique` ON `reservations` (`stripe_session_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer
);
