-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Dim 14 Février 2016 à 19:34
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `trickers`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `sport_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name_sport` (`sport_id`,`name`),
  KEY `fk_categories_sports1_idx` (`sport_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=10 ;

--
-- Contenu de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `sport_id`) VALUES
(4, 'flat', 1),
(3, 'half-pipe', 1),
(2, 'jib', 1),
(1, 'kicker', 1),
(8, 'flat', 2),
(7, 'half-pipe', 2),
(6, 'jib', 2),
(5, 'kicker', 2),
(9, 'freestyle', 5);

-- --------------------------------------------------------

--
-- Structure de la table `error_types`
--

CREATE TABLE IF NOT EXISTS `error_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=5 ;

--
-- Contenu de la table `error_types`
--

INSERT INTO `error_types` (`id`, `name`, `description`) VALUES
(1, 'Invalid sport, category or trick', 'The tag is invalid for one of the following reason: - The sport or the category is not the good one - The trick is not the good one'),
(2, 'Invalid time range', 'The trick and the category is good, but the time range is not.'),
(3, 'Invalid video', 'The video cannot be played'),
(4, 'Others', 'Any other errors');

-- --------------------------------------------------------

--
-- Structure de la table `report_errors`
--

CREATE TABLE IF NOT EXISTS `report_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `error_type_id` int(11) NOT NULL,
  `video_tag_id` int(11) NOT NULL,
  `comment` text CHARACTER SET utf8,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','ignored') CHARACTER SET utf8 DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_error_report_user` (`user_id`,`video_tag_id`,`status`),
  KEY `fk_report_users1_idx` (`user_id`),
  KEY `fk_report_video_tags1_idx` (`video_tag_id`),
  KEY `fk_report_errors_error_types1_idx` (`error_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=20 ;

--
-- Contenu de la table `report_errors`
--

INSERT INTO `report_errors` (`id`, `user_id`, `error_type_id`, `video_tag_id`, `comment`, `created`, `status`) VALUES
(4, 2, 4, 12, 'This is a melon grab not a mute grab...', '2016-01-08 13:20:39', 'pending'),
(7, NULL, 4, 63, 'vzvezvez', '2016-01-11 12:15:30', 'pending'),
(11, 2, 4, 74, 'Bad trick', '2016-01-14 10:54:01', 'pending'),
(12, 2, 4, 75, 'Bad trick', '2016-01-14 10:54:17', 'pending'),
(13, 2, 4, 67, NULL, '2016-01-15 10:37:59', 'pending'),
(16, 2, 4, 63, NULL, '2016-01-15 10:46:58', 'pending'),
(18, 2, 4, 57, NULL, '2016-01-15 10:48:32', 'pending'),
(19, 2, 4, 102, 'Invalid', '2016-02-10 17:15:40', 'pending');

--
-- Déclencheurs `report_errors`
--
DROP TRIGGER IF EXISTS `report_errors_AFTER_DELETE`;
DELIMITER //
CREATE TRIGGER `report_errors_AFTER_DELETE` AFTER DELETE ON `report_errors`
 FOR EACH ROW BEGIN
	IF OLD.video_tag_id IS NOT NULL THEN
		UPDATE video_tags SET count_report_errors = count_report_errors - 1 WHERE id = OLD.video_tag_id;
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `report_errors_AFTER_INSERT`;
DELIMITER //
CREATE TRIGGER `report_errors_AFTER_INSERT` AFTER INSERT ON `report_errors`
 FOR EACH ROW BEGIN
	UPDATE video_tags SET count_report_errors = count_report_errors + 1 WHERE id = NEW.video_tag_id;
	UPDATE users SET count_report_errors = count_report_errors + 1 WHERE id = NEW.user_id;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `riders`
--

CREATE TABLE IF NOT EXISTS `riders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) CHARACTER SET utf8 NOT NULL,
  `lastname` varchar(45) CHARACTER SET utf8 NOT NULL,
  `picture` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `picture_dir` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `count_tags` int(11) NOT NULL DEFAULT '0',
  `slug` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` enum('validated','pending') CHARACTER SET utf8 DEFAULT NULL,
  `nationality` varchar(3) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`),
  UNIQUE KEY `rider_UNIQUE` (`firstname`,`lastname`,`nationality`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `fk_riders_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=32 ;

--
-- Contenu de la table `riders`
--

INSERT INTO `riders` (`id`, `firstname`, `lastname`, `picture`, `picture_dir`, `user_id`, `level`, `count_tags`, `slug`, `status`, `nationality`) VALUES
(3, 'Marck', 'McMorris', NULL, '', NULL, 1, 2, 'marck-mcmorris-can', NULL, 'can'),
(4, 'sebastien', 'toutant', NULL, NULL, NULL, 1, 19, 'sebastien-toutant', NULL, 'can'),
(13, 'torstein', 'horgmo', NULL, NULL, NULL, 1, 0, 'torstein-horgmo', NULL, 'fr'),
(14, 'thomas', 'delfino', NULL, NULL, NULL, 1, 0, 'thomas-delfino', NULL, 'fr'),
(18, 'stéphane', 'Léonard', 'IMG_20141108_103325.jpg', 'c8e728e7-3ec0-4eaf-8369-2709efd40afa', 3, 1, 1, 'stephane-Leonard', '', 'fr'),
(19, 'xavier', 'de le rue', NULL, NULL, NULL, 2, 0, 'xavier-de-le-rue', NULL, 'fr'),
(20, 'victor', 'de le rue', NULL, NULL, NULL, 2, 8, 'victor-de-le-rue', NULL, 'fr'),
(21, 'stéphane 2', 'léonard', NULL, NULL, 2, 3, 0, 'stephane-2-leonard-fr', NULL, 'fr'),
(22, 'maxence', 'parrot', NULL, NULL, NULL, 3, 7, 'maxence-parrot-ca', NULL, 'ca'),
(23, 'torstein', 'horgmo', NULL, NULL, NULL, 3, 6, 'torstein-horgmo-no', NULL, 'no'),
(24, 'jesper', 'tjäder', NULL, NULL, NULL, 3, 6, 'jesper-tjaeder-se', NULL, 'se'),
(25, 'marcus', 'kleveland', NULL, NULL, NULL, 3, 1, 'marcus-kleveland-no', NULL, 'no'),
(26, 'test', 'test', NULL, NULL, NULL, 1, 0, 'test-test-al', NULL, 'al'),
(27, 'test', 'test', NULL, NULL, NULL, 3, 0, 'test-test-af', NULL, 'af'),
(28, 'test2', 'test', NULL, NULL, NULL, 2, 0, 'test2-test-af', NULL, 'af'),
(29, 'test', 'test3', NULL, NULL, NULL, 3, 0, 'test-test3-af', NULL, 'af'),
(30, 'test', 'test4', NULL, NULL, NULL, 1, 0, 'test-test4-al', NULL, 'al'),
(31, 'test34', 'test', NULL, NULL, NULL, 1, 0, 'test34-test-zm', NULL, 'zm');

-- --------------------------------------------------------

--
-- Structure de la table `social_accounts`
--

CREATE TABLE IF NOT EXISTS `social_accounts` (
  `user_id` int(11) NOT NULL,
  `social_provider_id` varchar(45) CHARACTER SET utf8 NOT NULL,
  `provider_uid` varchar(255) CHARACTER SET utf8 NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`social_provider_id`),
  UNIQUE KEY `unique_provider_and_uid` (`social_provider_id`,`provider_uid`),
  KEY `fk_social_accounts_users1_idx` (`user_id`),
  KEY `fk_social_accounts_scoial_providers1_idx` (`social_provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_providers`
--

CREATE TABLE IF NOT EXISTS `social_providers` (
  `id` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Contenu de la table `social_providers`
--

INSERT INTO `social_providers` (`id`) VALUES
('facebook');

-- --------------------------------------------------------

--
-- Structure de la table `sports`
--

CREATE TABLE IF NOT EXISTS `sports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `status` enum('public','private') CHARACTER SET utf8 DEFAULT 'public',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=6 ;

--
-- Contenu de la table `sports`
--

INSERT INTO `sports` (`id`, `name`, `status`) VALUES
(1, 'snowboard', 'public'),
(2, 'ski', 'public'),
(3, 'skate', 'private'),
(4, 'roller', 'private'),
(5, 'motocross', 'public');

-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8 NOT NULL,
  `count_ref` int(11) NOT NULL DEFAULT '0',
  `sport_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tags_sports1_idx` (`sport_id`),
  KEY `fk_tags_categories1_idx` (`category_id`),
  KEY `fk_tags_users1_idx` (`user_id`),
  KEY `unique_tag` (`name`,`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=97 ;

--
-- Contenu de la table `tags`
--

INSERT INTO `tags` (`id`, `name`, `count_ref`, `sport_id`, `category_id`, `user_id`, `created`, `slug`) VALUES
(1, 'frontside 360', 0, 1, 1, NULL, '2015-12-26 09:01:35', 'frontside_360'),
(2, 'frontside 540', 0, 1, 1, NULL, '2015-12-26 09:01:35', 'frontside_540'),
(3, 'backside 360', 0, 1, 1, NULL, '2015-12-26 09:01:35', 'backside_360'),
(4, 'backside 180', 0, 1, 1, NULL, '2015-12-26 09:01:35', 'backside_180'),
(5, 'backside 540', 0, 1, 1, NULL, '2015-12-26 09:01:35', 'backside_540'),
(10, 'backside rodeo 540 indy', 1, 1, 1, NULL, '2015-12-27 09:46:26', 'backside_rodeo_540_indy'),
(11, 'frontside 720 mute', 3, 1, 1, 2, '2015-12-27 15:05:05', 'frontside_720_mute'),
(13, 'frontside 540 mute', 2, 1, 1, 2, '2015-12-27 15:09:26', 'frontside_540_mute'),
(14, 'superman double front', 0, 2, 5, 2, '2015-12-28 10:25:00', 'superman-double-front'),
(15, 'switch 360 mute', 1, 2, 5, 2, '2015-12-28 10:29:33', 'switch-360-mute'),
(16, 'backside 720 mute', 1, 1, 1, 2, '2015-12-28 16:19:32', 'backside-720-mute'),
(17, 'backside 540 melon', 1, 1, 1, 2, '2015-12-28 16:21:34', 'backside-540-melon'),
(18, 'backside triple cork 1440 mute', 4, 1, 1, 2, '2015-12-28 16:43:43', 'backside-triple-cork-1440-mute'),
(19, 'double underflip indy', 1, 1, 1, 2, '2016-01-05 18:01:16', 'double-underflip-indy'),
(22, 'backside 540 nose grab', 1, 1, 1, 2, '2016-01-05 22:53:34', 'backside-540-nose-grab'),
(23, 'backside double cork 1080 mute', 4, 1, 1, 2, '2016-01-05 22:57:03', 'backside-double-cork-1080-mute'),
(24, 'backside double bio 1080 indy', 1, 1, 1, 2, '2016-01-06 09:00:34', 'backside-double-bio-1080-indy'),
(25, 'backside 1260 mute', 1, 1, 1, 2, '2016-01-07 12:15:15', 'backside-1260-mute'),
(26, 'fro', 1, 2, 7, 2, '2016-01-07 16:38:42', 'fro'),
(27, 'double backflip', 4, 2, 5, 2, '2016-01-08 09:37:20', 'double-backflip'),
(28, 'backside 720 method', 1, 1, 1, 2, '2016-01-08 10:42:36', 'backside-720-method'),
(29, 'frontflip', 1, 2, 8, 3, '2016-01-09 23:30:10', 'frontflip'),
(30, 'frontflip superman', 1, 2, 5, 3, '2016-01-09 23:35:55', 'frontflip-superman'),
(31, 'double backflip on one ski', 1, 2, 5, 3, '2016-01-09 23:38:13', 'double-backflip-on-one-ski'),
(32, 'backside 360 in', 1, 1, 2, 3, '2016-01-10 19:17:23', 'backside-360-in'),
(33, 'backside bio 720 nose grab', 1, 1, 1, 2, '2016-01-10 22:29:19', 'backside-bio-720-nose-grab'),
(34, 'backside 180 mute', 1, 1, 1, 2, '2016-01-10 22:32:58', 'backside-180-mute'),
(35, 'frontside double cork 1080 stalefish', 1, 1, 1, 2, '2016-01-10 22:39:44', 'frontside-double-cork-1080-stalefish'),
(36, 'frontside cork 900 tail grab', 1, 1, 1, 2, '2016-01-10 22:41:23', 'frontside-cork-900-tail-grab'),
(37, 'backside double rodeo 1260 stalefish', 1, 1, 1, 2, '2016-01-10 23:50:11', 'backside-double-rodeo-1260-stalefish'),
(38, 'frontside 1080 indy', 1, 1, 1, 2, '2016-01-10 23:51:43', 'frontside-1080-indy'),
(39, 'backside 540 indy', 1, 1, 1, 2, '2016-01-10 23:55:48', 'backside-540-indy'),
(40, 'frontside 720 tail grab', 1, 1, 1, 2, '2016-01-10 23:57:29', 'frontside-720-tail-grab'),
(41, 'frontside double cork 1080 mute', 4, 1, 1, 2, '2016-01-10 23:59:30', 'frontside-double-cork-1080-mute'),
(44, 'backside air', 2, 1, 3, 2, '2016-01-11 14:24:51', 'backside-air'),
(45, 'backside air', 0, 1, 3, 2, '2016-01-11 14:25:26', 'backside-air'),
(48, 'double backflip', 1, 5, 9, 2, '2016-01-14 11:21:59', 'double-backflip'),
(49, 'frontside double cork 1260 stalefish', 1, 1, 1, 3, '2016-01-14 16:22:53', 'frontside-double-cork-1260-stalefish'),
(50, 'frontside underflip 540 indy', 1, 1, 2, 3, '2016-01-14 16:27:24', 'frontside-underflip-540-indy'),
(51, 'frontside 900 tail grab', 1, 1, 2, 3, '2016-01-14 16:29:51', 'frontside-900-tail-grab'),
(52, 'backside rodeo 540 melon', 2, 1, 2, 3, '2016-01-14 16:32:08', 'backside-rodeo-540-melon'),
(53, 'backside 180 shifty', 1, 1, 1, 2, '2016-01-14 23:11:35', 'backside-180-shifty'),
(54, 'kiss of death backflip', 1, 5, 9, 2, '2016-01-14 23:53:00', 'kiss-of-death-backflip'),
(56, 'double grab', 1, 5, 9, 2, '2016-01-14 23:58:36', 'double-grab'),
(57, 'double underflip 1260 indy', 1, 1, 1, 3, '2016-01-15 14:25:35', 'double-underflip-1260-indy'),
(58, 'double backflip melon', 1, 1, 1, 2, '2016-01-24 17:12:30', 'double-backflip-melon'),
(59, 'double backside rodeo 900 melon', 2, 1, 1, 2, '2016-01-24 17:14:07', 'double-backside-rodeo-900-melon'),
(60, 'frontside 180', 1, 1, 1, 2, '2016-01-24 17:16:01', 'frontside-180'),
(61, 'backflip indy out', 1, 1, 2, 2, '2016-01-24 17:17:38', 'backflip-indy-out'),
(62, 'double backflip indy', 2, 1, 1, 2, '2016-01-24 17:19:25', 'double-backflip-indy'),
(63, 'backside 1080 mute', 1, 1, 1, 3, '2016-02-03 22:11:58', 'backside-1080-mute'),
(64, 'backside triple cork 1620 mute', 1, 1, 1, 2, '2016-02-04 14:49:10', 'backside-triple-cork-1620-mute'),
(65, 'backside triple cork 1620 mute', 0, 1, 1, 2, '2016-02-04 14:49:16', 'backside-triple-cork-1620-mute'),
(66, 'backside 360 in', 1, 1, 2, 3, '2016-02-04 19:54:56', 'backside-360-in'),
(67, 'backside cork 1080 indy', 1, 1, 1, 3, '2016-02-05 00:59:11', 'backside-cork-1080-indy'),
(68, 'backside cork 1080 indy', 0, 1, 1, 3, '2016-02-05 01:03:07', 'backside-cork-1080-indy'),
(69, 'fronstide 360 stalefish', 1, 1, 1, 3, '2016-02-06 08:43:43', 'fronstide-360-stalefish'),
(71, 'frontside 360 double shifty', 1, 1, 1, 3, '2016-02-06 12:12:07', 'frontside-360-double-shifty'),
(72, 'nollie', 0, 1, 4, 3, '2016-02-07 12:36:45', 'nollie'),
(73, 'nollie', 1, 1, 4, 3, '2016-02-07 12:38:01', 'nollie'),
(74, 'frontside 540', 0, 1, 1, 3, '2016-02-07 13:01:57', 'frontside-540'),
(75, 'to delete', 0, 1, 1, 2, '2016-02-12 12:57:24', 'to-delete'),
(76, 'frontside 270 in to 270 out', 0, 1, 2, 2, '2016-02-12 16:16:06', 'frontside-270-in-to-270-out'),
(77, 'frontside 270 in', 1, 1, 2, 2, '2016-02-12 17:04:59', 'frontside-270-in'),
(78, 'cab 270 in to 270 out', 1, 1, 2, 2, '2016-02-12 17:57:54', 'cab-270-in-to-270-out'),
(79, 'backside 270 in hardway', 1, 1, 2, 2, '2016-02-12 17:59:10', 'backside-270-in-hardway'),
(80, 'cab 270 in', 2, 1, 2, 2, '2016-02-12 18:44:12', 'cab-270-in'),
(81, 'cab double cork 1080 mute', 1, 1, 2, 2, '2016-02-12 18:46:09', 'cab-double-cork-1080-mute'),
(82, 'switch 1260 melon', 1, 1, 1, 2, '2016-02-12 18:48:14', 'switch-1260-melon'),
(83, 'switch backlip to 270 out', 1, 1, 2, 2, '2016-02-12 18:49:52', 'switch-backlip-to-270-out'),
(84, '270 out', 1, 1, 2, 2, '2016-02-12 18:50:59', '270-out'),
(85, 'switch quadruple underflip 1620 indy', 1, 1, 1, 2, '2016-02-12 19:26:27', 'switch-quadruple-underflip-1620-indy'),
(86, 'rodeo in', 1, 2, 5, 2, '2016-02-13 16:45:25', 'rodeo-in'),
(87, 'switch double frontflipt nose grab', 1, 2, 5, 2, '2016-02-13 16:55:19', 'switch-double-frontflipt-nose-grab'),
(88, 'hand drag double cork 1080 safety', 1, 2, 5, 2, '2016-02-13 16:57:20', 'hand-drag-double-cork-1080-safety'),
(89, 'backside quadruple cork 1800 mindy', 1, 1, 1, 2, '2016-02-14 11:39:29', 'backside-quadruple-cork-1800-mindy'),
(90, 'cab 900 mute', 1, 1, 2, 2, '2016-02-14 13:21:00', 'cab-900-mute'),
(91, 'backside double cork 1080 nose grab', 1, 1, 1, 2, '2016-02-14 13:23:01', 'backside-double-cork-1080-nose-grab'),
(92, 'backside 180 in to 180 out', 1, 1, 2, 2, '2016-02-14 13:27:49', 'backside-180-in-to-180-out'),
(93, 'cab double underflip 900 indy', 1, 1, 1, 2, '2016-02-14 13:30:07', 'cab-double-underflip-900-indy'),
(94, 'cab double cork 1080 mute', 1, 1, 1, 2, '2016-02-14 13:31:25', 'cab-double-cork-1080-mute'),
(95, 'cab double cork 1260 stalefish', 1, 1, 1, 2, '2016-02-14 13:33:22', 'cab-double-cork-1260-stalefish'),
(96, 'frontside 360 mute', 1, 1, 1, 2, '2016-02-14 13:38:34', 'frontside-360-mute');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `username` varchar(45) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `status` enum('activated','banned','blocked','created') CHARACTER SET utf8 NOT NULL,
  `count_tags` int(11) NOT NULL DEFAULT '0',
  `count_report_errors` int(11) DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `provider` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `provider_uid` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `provider_and_uid` (`provider`,`provider_uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=12 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `status`, `count_tags`, `count_report_errors`, `created`, `last_login`, `provider`, `provider_uid`) VALUES
(1, 'stef@gmail.com', '', '$2y$10$FG/i.axEibcBRvV0VTnjEOwZrLg1IU1SGv3kxhqZGvYO9plB642V.', 'activated', 23, 0, '2016-01-06 10:11:42', NULL, NULL, NULL),
(2, 'stef@tricker.com', 'stef@tricker.com', '$2y$10$BrAuL3GXU55X1kUYJs.m1eGkPcamVYAAYbG82evDQw47evxRvXnk6', 'activated', 89, 11, '2016-01-06 10:11:42', NULL, NULL, NULL),
(3, NULL, 'Stéphane Léonard', NULL, 'activated', 19, 0, '2016-01-09 22:31:51', NULL, 'facebook', '10208111125313888'),
(4, 'stef2@tricker.com', 'scallacs', '$2y$10$cEeSprRbnfkSHcKYrVqd3O1rqcuj6Jgv/HxcCgxIdAU7GcR0tBeea', 'activated', 0, 0, '2016-01-10 22:16:04', NULL, NULL, NULL),
(5, 'test@mail.com', 'test', '$2y$10$3FSWMO/mmEWyzXYRqfyqAutBw9RRMpEiJVIbFWJaulhBEqwidGaWq', 'activated', 0, 0, '2016-01-11 08:40:04', NULL, NULL, NULL),
(7, 'jacky@test.mail', 'jack', '$2y$10$jWgAiPJGhcf5EJbyn54UUehhqGFEdcGk51viO4PU5pQEQKRLf0KlO', 'activated', 0, 0, '2016-01-11 09:36:02', NULL, NULL, NULL),
(9, 'sca.leonard@gmail.com', 'sca.leonard@gmail.com', '$2y$10$TmngXMolI9eeAsOi7g/kJeU0Wud576.rZ/Yg8T0V3h3Gp1/81NPli', 'activated', 0, 0, '2016-01-14 15:35:33', NULL, NULL, NULL),
(10, NULL, 'Jack Overfield', NULL, 'activated', 0, 0, '2016-01-14 16:02:55', NULL, 'facebook', '444384409085423'),
(11, 'stef@tricker34.com', 'newuservalid', '$2y$10$0cpWEI8Z8FGbqn/AZv/.JuBwAMhQ0odUi8q6cGrq0puUtifROin8C', 'activated', 0, 0, '2016-02-09 23:08:56', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `videos`
--

CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `video_url` varchar(255) CHARACTER SET utf8 NOT NULL,
  `provider_id` varchar(45) CHARACTER SET utf8 NOT NULL,
  `count_tags` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `status` enum('public','private') CHARACTER SET utf8 NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_video_provider` (`video_url`,`provider_id`),
  KEY `fk_videos_sources_idx` (`provider_id`),
  KEY `fk_videos_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=130 ;

--
-- Contenu de la table `videos`
--

INSERT INTO `videos` (`id`, `video_url`, `provider_id`, `count_tags`, `user_id`, `created`, `modified`, `status`, `duration`) VALUES
(45, 'NNDT7p_sHBI', 'youtube', 4, 2, '2015-12-26 09:07:23', '2016-02-06 13:17:24', 'public', 140),
(48, 'DuFIVZo7WIM', 'youtube', 0, 2, '2015-12-26 11:40:08', '2016-02-06 13:17:25', 'public', 5474),
(49, 'VEQ-s679a10', 'youtube', 0, 2, '2015-12-26 11:51:17', '2016-02-06 13:17:25', 'public', 121),
(56, 'FCpZKsTqmkc', 'youtube', 4, 2, '2015-12-27 09:18:57', '2016-02-07 09:20:29', 'public', 240),
(57, '7-Mi5mG4BsQ', 'youtube', 1, 2, '2015-12-28 10:23:33', '2016-02-06 13:17:26', 'public', 350),
(58, 'eeCoNywb45U', 'youtube', 1, 2, '2015-12-28 10:26:09', '2016-02-06 13:17:27', 'public', 261),
(59, '1MQfbMoCfb4', 'youtube', 2, 2, '2015-12-28 15:54:54', '2016-02-06 13:17:27', 'public', 277),
(60, 'Ofc9hh0NWe8', 'youtube', 24, 2, '2015-12-28 16:17:49', '2016-02-14 13:38:34', 'public', 244),
(82, '6mEHw5q6Yfs', 'youtube', 0, 1, '2016-01-05 20:45:02', '2016-02-06 13:17:28', 'public', 1812),
(102, 'xb5LHuZGXi0', 'youtube', 0, 1, '2016-01-05 20:55:44', '2016-02-06 13:17:29', 'public', 131),
(103, 'k7-3xEpyAgo', 'youtube', 1, 2, '2016-01-08 09:35:12', '2016-02-06 13:17:29', 'public', 51),
(104, 'yrynZrGpQMY', 'youtube', 3, 2, '2016-01-08 10:38:44', '2016-02-06 13:17:30', 'public', 357),
(105, 'vbWkr7PWRfA', 'youtube', 3, 2, '2016-01-08 14:08:09', '2016-02-06 13:17:30', 'public', 3488),
(106, 'W3JXdLmxSHk', 'youtube', 3, 3, '2016-01-09 23:28:05', '2016-02-06 13:17:30', 'public', 157),
(107, 'Txyns-zD4n0', 'youtube', 1, 3, '2016-01-10 19:14:46', '2016-02-06 13:17:31', 'public', 749),
(108, 'rSHHzrgWUqk', 'youtube', 0, 2, '2016-01-10 22:25:56', '2016-02-06 13:17:32', 'public', 275),
(109, '0B_BpxmusXA', 'youtube', 9, 2, '2016-01-10 22:27:17', '2016-02-07 12:58:30', 'public', 235),
(110, 'OprCOLuUPzY', 'youtube', 6, 2, '2016-01-10 23:53:16', '2016-02-06 13:17:32', 'public', 213),
(111, 'PTfNhcoVH1g', 'youtube', 1, 2, '2016-01-12 10:04:41', '2016-02-06 13:17:33', 'public', 3017),
(112, '0o-xXXMXX1Q', 'youtube', 1, 2, '2016-01-14 11:21:13', '2016-02-06 13:17:34', 'public', 165),
(113, 'hDnGPpHEM6U', 'youtube', 9, 3, '2016-01-14 16:20:22', '2016-02-06 13:17:34', 'public', 294),
(114, 'FAjxL5km4wU', 'youtube', 1, 2, '2016-01-14 23:10:32', '2016-02-06 13:17:35', 'private', 0),
(115, 'QFUsEjZ6ppU', 'youtube', 7, 2, '2016-01-24 16:28:50', '2016-02-12 10:42:45', 'public', 234),
(116, 'b8LNh5iO0Hk', 'youtube', 3, 3, '2016-02-05 00:36:22', '2016-02-06 13:17:35', 'public', 374),
(117, 'S7FL8JN2s60', 'youtube', 0, 3, '2016-02-05 20:01:50', '2016-02-06 13:17:36', 'public', 106),
(118, 'e4tEOuDXA7Y', 'youtube', 0, 3, '2016-02-05 20:12:13', '2016-02-06 13:17:36', 'public', 177),
(119, 'GW_lV0dW6nA', 'youtube', 1, 3, '2016-02-06 12:10:34', '2016-02-06 13:17:37', 'public', 11),
(120, 'KoHzXi7Usl8', 'youtube', 0, 2, '2016-02-12 10:40:44', NULL, 'public', 160),
(121, 'GF6Ct6B1yfM', 'youtube', 0, 2, '2016-02-12 10:41:51', NULL, 'public', 652),
(122, 'SK3QUktvWbI', 'youtube', 0, 2, '2016-02-12 13:40:53', NULL, 'public', 321),
(123, 'aK_u64s2zNA', 'youtube', 9, 2, '2016-02-12 16:12:17', '2016-02-12 18:24:53', 'public', 150),
(124, '4efHnJ-T6co', 'youtube', 6, 2, '2016-02-12 18:40:21', '2016-02-14 11:20:17', 'public', 204),
(125, 'vUNyKJKMYg4', 'youtube', 1, 2, '2016-02-12 18:56:18', '2016-02-12 18:57:37', 'public', 127),
(126, 'KSdx9gNmqlc', 'youtube', 1, 2, '2016-02-12 19:24:35', '2016-02-12 19:26:27', 'public', 73),
(127, '4rtoQzPM_KA', 'youtube', 0, 2, '2016-02-13 09:52:01', NULL, 'public', 1209),
(128, 'K4lt74KUpAA', 'youtube', 5, 2, '2016-02-13 16:41:32', '2016-02-13 16:58:34', 'public', 230),
(129, 'jaA_nnfzrFE', 'youtube', 1, 2, '2016-02-14 11:30:15', '2016-02-14 11:39:30', 'public', 128);

--
-- Déclencheurs `videos`
--
DROP TRIGGER IF EXISTS `videos_AFTER_INSERT`;
DELIMITER //
CREATE TRIGGER `videos_AFTER_INSERT` AFTER INSERT ON `videos`
 FOR EACH ROW BEGIN

END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `videos_BEFORE_UPDATE`;
DELIMITER //
CREATE TRIGGER `videos_BEFORE_UPDATE` BEFORE UPDATE ON `videos`
 FOR EACH ROW BEGIN
	SET NEW.modified := CURRENT_TIMESTAMP;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `video_providers`
--

CREATE TABLE IF NOT EXISTS `video_providers` (
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Contenu de la table `video_providers`
--

INSERT INTO `video_providers` (`name`) VALUES
('youtube');

-- --------------------------------------------------------

--
-- Structure de la table `video_tags`
--

CREATE TABLE IF NOT EXISTS `video_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `video_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rider_id` int(11) DEFAULT NULL,
  `begin` decimal(5,2) NOT NULL,
  `end` decimal(5,2) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `count_points` int(11) NOT NULL DEFAULT '0',
  `count_report_errors` int(11) NOT NULL DEFAULT '0',
  `status` enum('pending','validated','rejected','blocked') CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_has_videos_videos1_idx` (`video_id`),
  KEY `fk_users_has_videos_users1_idx` (`user_id`),
  KEY `fk_users_has_videos_tags1_idx` (`tag_id`),
  KEY `fk_video_tags_riders1_idx` (`rider_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=137 ;

--
-- Contenu de la table `video_tags`
--

INSERT INTO `video_tags` (`id`, `video_id`, `tag_id`, `user_id`, `rider_id`, `begin`, `end`, `created`, `count_points`, `count_report_errors`, `status`) VALUES
(11, 56, 10, 2, NULL, '32.13', '38.24', '2015-12-27 09:46:26', 1, 0, 'validated'),
(12, 56, 11, 2, NULL, '61.13', '64.63', '2015-12-27 15:05:05', 1, 1, 'validated'),
(16, 58, 15, 2, NULL, '112.62', '116.38', '2015-12-28 10:29:33', 1, 0, 'validated'),
(18, 60, 16, 2, 4, '4.50', '12.55', '2015-12-28 16:19:32', 1, 0, 'validated'),
(19, 60, 17, 2, 4, '34.50', '40.00', '2015-12-28 16:21:35', 2, 0, 'validated'),
(20, 60, 18, 2, 4, '178.00', '187.76', '2015-12-28 16:43:43', 1, 0, 'validated'),
(21, 60, 19, 2, 4, '28.00', '34.00', '2016-01-05 18:01:17', 1, 0, 'validated'),
(46, 60, 22, 2, 4, '150.00', '162.00', '2016-01-05 22:53:34', 1, 0, 'validated'),
(47, 60, 23, 2, 4, '193.50', '212.30', '2016-01-05 22:57:03', 1, 0, 'validated'),
(48, 60, 24, 2, 4, '56.17', '62.17', '2016-01-06 09:00:35', 2, 0, 'validated'),
(53, 59, 25, 2, NULL, '85.00', '98.78', '2016-01-07 12:15:17', 1, 0, 'validated'),
(54, 60, 26, 2, NULL, '0.00', '3.00', '2016-01-07 16:38:43', -1, 0, 'validated'),
(55, 103, 27, 2, 24, '17.50', '41.50', '2016-01-08 09:37:20', 2, 0, 'validated'),
(56, 104, 11, 2, NULL, '57.00', '61.50', '2016-01-08 10:40:46', 2, 0, 'validated'),
(57, 104, 28, 2, NULL, '68.50', '73.00', '2016-01-08 10:42:36', 1, 1, 'validated'),
(58, 104, 27, 2, NULL, '267.00', '273.00', '2016-01-08 19:44:28', 1, 0, 'validated'),
(59, 106, 29, 3, NULL, '56.00', '59.00', '2016-01-09 23:30:10', 0, 0, 'validated'),
(60, 106, 30, 3, NULL, '22.00', '24.50', '2016-01-09 23:35:55', 0, 0, 'validated'),
(61, 106, 31, 3, NULL, '81.69', '84.92', '2016-01-09 23:38:13', 0, 0, 'validated'),
(62, 107, 32, 3, NULL, '390.67', '396.50', '2016-01-10 19:17:23', 0, 0, 'validated'),
(63, 109, 33, 2, 20, '66.62', '71.88', '2016-01-10 22:29:20', 4, 2, 'validated'),
(64, 109, 34, 2, 20, '95.50', '98.00', '2016-01-10 22:32:58', 1, 0, 'validated'),
(65, 109, 23, 2, 20, '115.00', '122.36', '2016-01-10 22:38:23', 2, 0, 'validated'),
(66, 109, 35, 2, 20, '129.30', '135.22', '2016-01-10 22:39:44', 0, 0, 'validated'),
(67, 109, 36, 2, 20, '138.50', '142.13', '2016-01-10 22:41:23', 3, 1, 'validated'),
(68, 109, 37, 2, 20, '174.00', '179.69', '2016-01-10 23:50:11', 1, 0, 'validated'),
(69, 109, 38, 2, 20, '217.00', '221.14', '2016-01-10 23:51:44', 0, 0, 'validated'),
(70, 110, 39, 2, NULL, '68.00', '72.00', '2016-01-10 23:55:48', 0, 0, 'validated'),
(71, 110, 40, 2, NULL, '95.50', '99.50', '2016-01-10 23:57:30', 0, 0, 'validated'),
(72, 110, 41, 2, NULL, '141.00', '146.00', '2016-01-10 23:59:30', 0, 0, 'validated'),
(73, 110, 41, 2, NULL, '23.02', '29.57', '2016-01-11 00:03:26', 1, 0, 'validated'),
(74, 110, 44, 2, NULL, '24.00', '26.00', '2016-01-11 14:24:52', -1, 1, 'validated'),
(75, 110, 44, 2, NULL, '54.00', '68.00', '2016-01-11 14:27:21', -1, 1, 'validated'),
(77, 112, 48, 2, NULL, '29.00', '33.50', '2016-01-14 11:22:00', 1, 0, 'validated'),
(78, 113, 49, 3, NULL, '16.52', '20.93', '2016-01-14 16:22:53', 1, 0, 'validated'),
(79, 113, 23, 3, 4, '27.45', '31.33', '2016-01-14 16:24:34', 0, 0, 'validated'),
(80, 113, 50, 3, NULL, '93.00', '99.50', '2016-01-14 16:27:24', 0, 0, 'validated'),
(81, 113, 51, 3, NULL, '108.25', '114.01', '2016-01-14 16:29:51', 0, 0, 'validated'),
(82, 113, 52, 3, NULL, '208.00', '213.50', '2016-01-14 16:32:09', 1, 0, 'validated'),
(83, 113, 18, 3, 4, '225.00', '241.50', '2016-01-14 16:33:25', 1, 0, 'validated'),
(84, 114, 53, 2, NULL, '3.41', '8.17', '2016-01-14 23:11:36', 0, 0, 'validated'),
(85, 105, 54, 2, NULL, '251.30', '258.30', '2016-01-14 23:53:00', 1, 0, 'validated'),
(86, 105, 54, 2, NULL, '322.36', '326.60', '2016-01-14 23:54:09', 1, 0, 'validated'),
(87, 105, 56, 2, NULL, '492.66', '496.84', '2016-01-14 23:58:37', 0, 0, 'validated'),
(88, 113, 57, 3, NULL, '102.50', '107.50', '2016-01-15 14:25:35', 0, 0, 'validated'),
(89, 115, 58, 2, NULL, '86.06', '92.56', '2016-01-24 17:12:31', 1, 0, 'validated'),
(90, 115, 59, 2, NULL, '118.00', '123.50', '2016-01-24 17:14:07', 0, 0, 'validated'),
(91, 115, 60, 2, NULL, '152.94', '155.94', '2016-01-24 17:16:01', 0, 0, 'validated'),
(92, 115, 61, 2, NULL, '171.91', '176.91', '2016-01-24 17:17:38', 0, 0, 'validated'),
(93, 115, 62, 2, NULL, '216.00', '219.50', '2016-01-24 17:19:25', 0, 0, 'validated'),
(94, 113, 63, 3, NULL, '219.45', '224.00', '2016-02-03 22:11:58', 0, 0, 'validated'),
(95, 115, 64, 2, NULL, '176.68', '186.00', '2016-02-04 14:49:10', 0, 0, 'validated'),
(96, 113, 66, 3, 4, '245.50', '248.50', '2016-02-04 19:54:56', 0, 0, 'validated'),
(97, 116, 67, 3, NULL, '53.50', '62.32', '2016-02-05 00:59:11', 0, 0, 'validated'),
(98, 116, 18, 3, 13, '319.92', '325.50', '2016-02-05 19:56:52', 0, 0, 'validated'),
(99, 116, 69, 3, 13, '49.30', '53.30', '2016-02-06 08:43:43', 0, 0, 'validated'),
(100, 119, 71, 3, NULL, '4.50', '9.50', '2016-02-06 12:12:07', 0, 0, 'validated'),
(101, 109, 73, 3, 20, '0.00', '2.00', '2016-02-07 12:38:01', 0, 0, 'validated'),
(102, 109, 11, 3, 18, '6.00', '11.50', '2016-02-07 12:58:30', -1, 1, 'validated'),
(103, 115, 13, 2, 3, '0.00', '6.50', '2016-02-12 10:42:45', 0, 0, 'validated'),
(107, 123, 78, 2, 22, '2.16', '6.15', '2016-02-12 17:57:54', 0, 0, 'validated'),
(108, 123, 79, 2, 22, '8.42', '11.93', '2016-02-12 17:59:10', 0, 0, 'validated'),
(109, 123, 77, 2, 22, '13.50', '17.00', '2016-02-12 18:15:25', 0, 0, 'validated'),
(110, 123, 41, 2, 22, '18.50', '23.57', '2016-02-12 18:18:38', 0, 0, 'validated'),
(111, 123, 59, 2, 22, '24.00', '29.00', '2016-02-12 18:20:01', 0, 0, 'validated'),
(112, 123, 18, 2, 22, '35.00', '41.34', '2016-02-12 18:24:53', 0, 0, 'validated'),
(113, 124, 80, 2, 23, '26.45', '30.45', '2016-02-12 18:44:12', 0, 0, 'validated'),
(114, 124, 81, 2, 23, '41.50', '48.00', '2016-02-12 18:46:09', 0, 0, 'validated'),
(115, 124, 82, 2, 23, '49.00', '54.00', '2016-02-12 18:48:14', 0, 0, 'validated'),
(116, 124, 83, 2, 23, '32.09', '35.05', '2016-02-12 18:49:52', 0, 0, 'validated'),
(117, 124, 84, 2, 23, '36.00', '40.50', '2016-02-12 18:50:59', 0, 0, 'validated'),
(118, 125, 62, 2, 3, '51.00', '55.30', '2016-02-12 18:57:37', 0, 0, 'validated'),
(119, 126, 85, 2, 22, '17.00', '53.50', '2016-02-12 19:26:27', 0, 0, 'validated'),
(120, 128, 27, 2, 24, '25.50', '30.50', '2016-02-13 16:43:18', 1, 0, 'validated'),
(121, 128, 86, 2, 24, '111.00', '117.00', '2016-02-13 16:45:25', 0, 0, 'validated'),
(122, 128, 87, 2, 24, '139.00', '151.00', '2016-02-13 16:55:20', 0, 0, 'validated'),
(123, 128, 88, 2, 24, '156.50', '168.50', '2016-02-13 16:57:20', 0, 0, 'validated'),
(124, 128, 27, 2, 24, '212.00', '220.00', '2016-02-13 16:58:34', 1, 0, 'validated'),
(125, 124, 80, 2, 23, '76.00', '81.50', '2016-02-14 11:20:17', 0, 0, 'validated'),
(126, 129, 89, 2, 25, '71.50', '88.00', '2016-02-14 11:39:30', 0, 0, 'validated'),
(127, 60, 52, 2, 4, '44.00', '46.50', '2016-02-14 13:19:45', 0, 0, 'validated'),
(128, 60, 90, 2, 4, '63.00', '71.00', '2016-02-14 13:21:00', 0, 0, 'validated'),
(129, 60, 91, 2, 4, '72.00', '80.50', '2016-02-14 13:23:01', 0, 0, 'validated'),
(130, 60, 23, 2, 4, '82.00', '92.00', '2016-02-14 13:24:33', 0, 0, 'validated'),
(131, 60, 41, 2, 4, '99.18', '102.18', '2016-02-14 13:26:24', 0, 0, 'validated'),
(132, 60, 92, 2, 4, '114.00', '116.50', '2016-02-14 13:27:49', 0, 0, 'validated'),
(133, 60, 93, 2, 4, '122.00', '130.00', '2016-02-14 13:30:07', 0, 0, 'validated'),
(134, 60, 94, 2, 4, '133.00', '138.50', '2016-02-14 13:31:25', 0, 0, 'validated'),
(135, 60, 95, 2, 4, '141.00', '147.50', '2016-02-14 13:33:23', 0, 0, 'validated'),
(136, 60, 96, 2, 4, '14.50', '25.00', '2016-02-14 13:38:34', 0, 0, 'validated');

--
-- Déclencheurs `video_tags`
--
DROP TRIGGER IF EXISTS `video_tags_AFTER_DELETE`;
DELIMITER //
CREATE TRIGGER `video_tags_AFTER_DELETE` AFTER DELETE ON `video_tags`
 FOR EACH ROW BEGIN
	
    IF OLD.tag_id IS NOT NULL THEN 
		UPDATE tags SET count_ref = count_ref - 1 WHERE id = OLD.tag_id;
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `video_tags_AFTER_INSERT`;
DELIMITER //
CREATE TRIGGER `video_tags_AFTER_INSERT` AFTER INSERT ON `video_tags`
 FOR EACH ROW BEGIN
	IF NEW.user_id IS NOT NULL THEN
		UPDATE users SET count_tags = count_tags + 1 WHERE id = NEW.user_id;
    END IF;
    IF NEW.tag_id IS NOT NULL THEN 
		UPDATE tags SET count_ref = count_ref + 1 WHERE id = NEW.tag_id;
	END IF;
    IF NEW.video_id IS NOT NULL THEN 
		UPDATE videos SET count_tags = count_tags + 1 WHERE id = NEW.video_id;
	END IF;
    IF NEW.rider_id IS NOT NULL THEN 
		UPDATE riders SET count_tags = count_tags + 1 WHERE id = NEW.rider_id;
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `video_tags_AFTER_UPDATE`;
DELIMITER //
CREATE TRIGGER `video_tags_AFTER_UPDATE` AFTER UPDATE ON `video_tags`
 FOR EACH ROW BEGIN
    IF NEW.rider_id IS NOT NULL THEN 
		UPDATE riders SET count_tags = count_tags + 1 WHERE id = NEW.rider_id;
	END IF;
    IF OLD.rider_id IS NOT NULL THEN 
		UPDATE riders SET count_tags = count_tags - 1 WHERE id = OLD.rider_id;
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `video_tags_BEFORE_DELETE`;
DELIMITER //
CREATE TRIGGER `video_tags_BEFORE_DELETE` BEFORE DELETE ON `video_tags`
 FOR EACH ROW BEGIN
    IF OLD.rider_id IS NOT NULL THEN 
		UPDATE riders SET count_tags = count_tags - 1 WHERE id = OLD.rider_id;
	END IF;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `video_tag_points`
--

CREATE TABLE IF NOT EXISTS `video_tag_points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` tinyint(2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `video_tag_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_video_tag_user` (`user_id`,`video_tag_id`),
  KEY `fk_video_tag_points_video_tags1_idx` (`video_tag_id`),
  KEY `fk_video_tag_points_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=62 ;

--
-- Contenu de la table `video_tag_points`
--

INSERT INTO `video_tag_points` (`id`, `value`, `user_id`, `video_tag_id`) VALUES
(5, 1, 2, 11),
(6, 1, 2, 12),
(13, 1, 2, 16),
(15, 1, 2, 20),
(16, 1, 2, 19),
(17, 1, 2, 18),
(19, 1, 2, 46),
(20, 1, 2, 47),
(21, 1, 2, 48),
(24, 1, 2, 55),
(25, 1, 3, 55),
(26, 1, 3, 48),
(27, 1, 3, 57),
(28, 1, 2, 63),
(29, 1, 5, 63),
(30, 1, 5, 64),
(35, 1, 2, 21),
(36, 1, 2, 53),
(37, 1, 2, 56),
(38, 1, 2, 73),
(39, -1, 2, 74),
(40, -1, 2, 75),
(41, 1, 3, 67),
(42, 1, 3, 68),
(43, 1, 10, 65),
(44, 1, 10, 67),
(45, 1, 2, 86),
(46, 1, 2, 85),
(47, 1, 2, 83),
(49, 1, 2, 78),
(50, 1, 3, 56),
(51, 1, 3, 19),
(52, 1, 3, 82),
(53, 1, 3, 63),
(54, -1, 2, 102),
(55, 1, 2, 65),
(56, 1, 2, 67),
(57, 1, 2, 58),
(58, 1, 2, 120),
(59, 1, 2, 124),
(60, 1, 2, 77),
(61, 1, 2, 89);

--
-- Déclencheurs `video_tag_points`
--
DROP TRIGGER IF EXISTS `video_tag_points_AFTER_INSERT`;
DELIMITER //
CREATE TRIGGER `video_tag_points_AFTER_INSERT` AFTER INSERT ON `video_tag_points`
 FOR EACH ROW BEGIN
	IF NEW.video_tag_id IS NOT NULL THEN
		UPDATE video_tags SET count_points = count_points + NEW.`value` WHERE id = NEW.video_tag_id; 
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `video_tag_points_AFTER_UPDATE`;
DELIMITER //
CREATE TRIGGER `video_tag_points_AFTER_UPDATE` AFTER UPDATE ON `video_tag_points`
 FOR EACH ROW BEGIN

	IF OLD.`value` IS NOT NULL AND NEW.`value` IS NOT NULL THEN
		UPDATE video_tags SET count_points = (count_points + NEW.`value` - OLD.`value`) WHERE id = NEW.video_tag_id; 
	END IF;
END
//
DELIMITER ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_sports1` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `report_errors`
--
ALTER TABLE `report_errors`
  ADD CONSTRAINT `fk_report_errors_error_types1` FOREIGN KEY (`error_type_id`) REFERENCES `error_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `fk_report_video_tags1` FOREIGN KEY (`video_tag_id`) REFERENCES `video_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `riders`
--
ALTER TABLE `riders`
  ADD CONSTRAINT `fk_riders_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `social_accounts`
--
ALTER TABLE `social_accounts`
  ADD CONSTRAINT `fk_social_accounts_scoial_providers1` FOREIGN KEY (`social_provider_id`) REFERENCES `social_providers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_social_accounts_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `fk_tags_categories1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_tags_sports1` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_tags_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Contraintes pour la table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_videos_sources` FOREIGN KEY (`provider_id`) REFERENCES `video_providers` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_videos_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Contraintes pour la table `video_tags`
--
ALTER TABLE `video_tags`
  ADD CONSTRAINT `fk_users_has_videos_tags1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_users_has_videos_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `fk_users_has_videos_videos1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_video_tags_riders1` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `video_tag_points`
--
ALTER TABLE `video_tag_points`
  ADD CONSTRAINT `fk_video_tag_points_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_video_tag_points_video_tags1` FOREIGN KEY (`video_tag_id`) REFERENCES `video_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
