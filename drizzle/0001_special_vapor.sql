CREATE TABLE `audioFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`text` text NOT NULL,
	`voiceId` varchar(128) NOT NULL,
	`voiceName` varchar(255) NOT NULL,
	`audioUrl` text NOT NULL,
	`audioKey` text NOT NULL,
	`format` varchar(20) NOT NULL DEFAULT 'mp3',
	`shareToken` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audioFiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `audioFiles_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `voiceClones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`voiceId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`originalAudioUrl` text NOT NULL,
	`originalAudioKey` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceClones_id` PRIMARY KEY(`id`)
);
