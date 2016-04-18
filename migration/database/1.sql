ALTER TABLE `sports` 
ADD COLUMN `position` INT(11) NULL DEFAULT NULL AFTER `slug`;

ALTER TABLE `categories` 
ADD COLUMN `status` ENUM('public', 'private') NOT NULL AFTER `slug`,
ADD COLUMN `position` INT(11) NULL DEFAULT NULL AFTER `status`;

ALTER TABLE `tags` CHANGE `status` `status` ENUM('rejected','pending','validated', 'blacklist') 
CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
