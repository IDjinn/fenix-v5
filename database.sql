CREATE TABLE `1fenix_bot` (
	`id` VARCHAR(50) NOT NULL,
	`prefix` VARCHAR(5) NOT NULL DEFAULT '>',
	`administrator_roles` VARCHAR(50) NULL DEFAULT NULL,
	`moderator_roles` VARCHAR(50) NULL DEFAULT NULL,
	`socket_host` VARCHAR(50) NULL DEFAULT NULL,
	`socket_port` VARCHAR(50) NULL DEFAULT NULL,
	`socket_token` VARCHAR(50) NULL DEFAULT NULL,
	`autorole_enabled` ENUM('0','1') NOT NULL DEFAULT '0',
	`welcome_join_enabled` ENUM('0','1') NOT NULL DEFAULT '0',
	`welcome_leave_enabled` ENUM('0','1') NOT NULL DEFAULT '0',
	`counter_member_enabled` ENUM('0','1') NOT NULL DEFAULT '0',
	`automod_invites_enabled` ENUM('0','1') NOT NULL DEFAULT '0',
	`command_channels` VARCHAR(50) NULL DEFAULT NULL,
	`counter_member_channel` VARCHAR(50) NULL DEFAULT NULL,
	`welcome_join_channel` VARCHAR(50) NULL DEFAULT NULL,
	`welcome_leave_channel` VARCHAR(50) NULL DEFAULT NULL,
	`welcome_join_embed` VARCHAR(4000) NULL DEFAULT NULL,
	`welcome_leave_embed` VARCHAR(4000) NULL DEFAULT NULL,
	`autorole_roles` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
