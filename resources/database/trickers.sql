-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 01 Mars 2016 à 00:27
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
-- Structure de la table `playlists`
--

CREATE TABLE IF NOT EXISTS `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8_polish_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('public','private','blocked') COLLATE utf8_polish_ci NOT NULL,
  `count_points` int(11) NOT NULL DEFAULT '0',
  `count_up` int(11) NOT NULL DEFAULT '0',
  `slug` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `count_tags` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_playlists_users1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci AUTO_INCREMENT=28 ;

--
-- Contenu de la table `playlists`
--

INSERT INTO `playlists` (`id`, `title`, `description`, `created`, `modified`, `user_id`, `status`, `count_points`, `count_up`, `slug`, `count_tags`) VALUES
(3, 'Amazing flips', 'Gather the most amazing flips in all sports !', '2016-02-29 08:00:24', '2016-02-29 17:15:22', 2, 'public', 1, 1, '', 7),
(4, 'Learning', 'All the tricks that I''m currently learning', '2016-02-29 09:59:25', '2016-02-29 09:59:25', 2, 'private', 1, 1, '', 2),
(5, 'Quadruples', 'Gather all quadruples ever landed. Becarefull it''s powerfull! You will be amzed!', '2016-02-29 11:05:08', '2016-02-29 16:49:07', 2, 'public', 1, 1, '', 1),
(7, 'Lot of description', 'Lorem ipsum dolor sit amet, dolor legendos et eos, vis ex quis intellegebat. Elitr aperiam reformidans nec ex. Aperiri eruditi in mei, veritus feugait ad mea. Has ut iudico albucius rationibus, eam voluptua vulputate pertinacia an, mea wisi persius imperdiet at.\n\nUt mel albucius constituam conclusionemque. Dolor insolens tincidunt pro ad. Eos delenit platonem ei, ex ornatus albucius pro, modo sint his te. Tacimates omittantur mei ut, debitis volumus neglegentur ex nec. Perfecto deserunt vis ne, ex vel ipsum vocibus suavitate.\n\nId sed case dictas eloquentiam. Qui ubique urbanitas ad, per cu soluta inermis fabellas. Ea aliquam dissentias referrentur sit, id labores postulant incorrupte sed. Eum in paulo scaevola sensibus, id graecis vivendum est.\n\nUt mel albucius constituam conclusionemque. Dolor insolens tincidunt pro ad. Eos delenit platonem ei, ex ornatus albucius pro, modo sint his te. Tacimates omittantur mei ut, debitis volumus neglegentur ex nec. Perfecto deserunt vis ne.', '2016-02-29 12:08:28', '2016-02-29 12:08:28', 2, 'public', 0, 0, '', 0),
(8, 'fezfezezfefez', 'ffezfezfez', '2016-02-29 13:08:12', '2016-02-29 13:08:12', 2, 'public', 0, 0, '', 0),
(19, 'Amazing flips', 'Gather the most amazing flips in all sports !', '2016-02-29 16:26:09', '2016-02-29 16:26:09', 2, 'public', 0, 0, '', 0),
(21, 'Test create and ad', 'yep', '2016-02-29 21:02:03', '2016-02-29 21:02:03', 2, 'public', 0, 0, '', 1),
(22, 'fezfez', 'fezfezfez', '2016-02-29 21:02:52', '2016-02-29 21:02:52', 2, 'public', 0, 0, '', 1),
(23, 'AAAAAAAAAAA', 'test', '2016-02-29 21:05:53', '2016-02-29 21:05:53', 2, 'public', 0, 0, '', 2),
(24, 'fezfez', 'fezfezfezff', '2016-02-29 21:17:02', '2016-02-29 21:17:02', 2, 'private', 0, 0, '', 1),
(25, 'Teste', 'ETzt', '2016-02-29 21:17:39', '2016-02-29 21:17:39', 2, 'public', 0, 0, '', 2),
(26, 'zaraz', 'rzaraz', '2016-02-29 21:18:55', '2016-02-29 21:18:55', 2, 'public', 0, 0, '', 2),
(27, 'My new plaulist', 'test', '2016-02-29 21:46:09', '2016-02-29 21:46:09', 2, 'public', 0, 0, '', 0);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `fk_playlists_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
