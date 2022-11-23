-- Create database
DROP DATABASE IF EXISTS `mobileapp`;

CREATE DATABASE `mobileapp`;

ALTER DATABASE `mobileapp` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `mobileapp`;

-- Create users table and insert default user
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `password` varchar(64) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4;

INSERT INTO mobileapp.users (id, username, password, registered_at) VALUES(1000, 'tunnus', '$2a$10$RSO5PUohfqobOpIjFOI75OhtKATVWmcJh4GC5TEkyyNWGvfZ72uU.', '2021-10-04 15:01:12');
INSERT INTO mobileapp.users (id, username, password, registered_at) VALUES(1001, 'tunnus1', '$2a$10$0khwFLFQ2.cPZ2Jrk26F4.WdHkCEXJOIi/FZAGQac4T4B/O9.SQjC', '2021-10-04 15:01:12');
INSERT INTO mobileapp.users (id, username, password, registered_at) VALUES(1002, 'tunnus2', '$2a$10$VxqefOSejCahCbq9Eg4QuumQ8pQfkjYqJD.dxmxTOixYdKy7bRFaC', '2021-10-05 09:55:00');

-- TODO: Create reviews table
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `content` text NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_UN` (`game_id`,`user_id`),
  KEY `reviews_FK` (`user_id`),
  CONSTRAINT `reviews_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE mobileapp.reviews ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL;


-- Test reviews for GTAV, The Wither 3 and Portal 2 (all top games)
INSERT INTO mobileapp.reviews (id, game_id, user_id, title, content, rating) VALUES(1, 4200, 1000, 'Good game!', 'Portal 2 is actually pretty good', 4.5);
INSERT INTO mobileapp.reviews (id, game_id, user_id, title, content, rating) VALUES(2, 4200, 1001, 'Meh', 'Could have been better', 3.0);
INSERT INTO mobileapp.reviews (id, game_id, user_id, title, content, rating) VALUES(3, 4200, 1002, 'well actually..', 'This will be a long one... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 1.0);
INSERT INTO mobileapp.reviews (id, game_id, user_id, title, content, rating) VALUES(4, 3498, 1001, 'A classic', 'GTAV is a cool game!', 5.0);
INSERT INTO mobileapp.reviews (id, game_id, user_id, title, content, rating) VALUES(5, 3328, 1000, 'Too long', 'The witcher 3 is way too long. stopped playing mid playthrough', 2.0);

CREATE TABLE `gamelists` (
  `username` TEXT NOT NULL,
  `gamelist` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
