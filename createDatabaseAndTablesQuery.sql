CREATE DATABASE IF NOT EXISTS `light_control`;

use `light_control`;

CREATE TABLE
    IF NOT EXISTS `configs` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `key` VARCHAR(255) NOT NULL,
        `value` BOOLEAN NOT NULL,
        `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`, `key`)
    );

CREATE TABLE
    IF NOT EXISTS `roles` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `label` varchar(50) NOT NULL,
        `description` varchar(255) NOT NULL,
        `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`, `label`)
    );

CREATE TABLE
    IF NOT EXISTS `users` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password_encrypted` varchar(255) NOT NULL,
        `roleid` INT NOT NULL,
        `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`, `username`),
        FOREIGN KEY (`roleid`) REFERENCES `roles`(`id`)
    );

CREATE TABLE
    IF NOT EXISTS `lights` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `key` VARCHAR(100) NOT NULL,
        `is_rgb` BOOLEAN NOT NULL,
        `color` VARCHAR(7) NOT NULL,
        `dimmable` BOOLEAN NOT NULL,
        `luminosity` FLOAT(2, 1) NOT NULL,
        `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`, `key`)
    );

INSERT INTO
    `configs` (`key`, `value`)
SELECT *
FROM (
        SELECT
            "enableAccountCreation" AS `key`,
            true AS `value`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `key`
        FROM `configs`
        WHERE
            `key` = 'enableAccountCreation'
    )
LIMIT 1;

INSERT INTO
    `configs` (`key`, `value`)
SELECT *
FROM (
        SELECT
            "useAccounts" AS `key`,
            true AS `value`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `key`
        FROM `configs`
        WHERE
            `key` = 'useAccounts'
    )
LIMIT 1;

INSERT INTO
    `roles` (`label`, `description`)
SELECT *
FROM (
        SELECT
            "admin" AS `label`,
            "Admin Rolle mit allen Rechten" AS `description`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `label`
        FROM `roles`
        WHERE
            `label` = 'admin'
    )
LIMIT 1;

INSERT INTO
    `roles` (`label`, `description`)
SELECT *
FROM (
        SELECT
            "user" AS `label`,
            "Benutzer Rolle mit eingeschränkten Rechten" AS `description`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `label`
        FROM `roles`
        WHERE `label` = 'user'
    )
LIMIT 1;

INSERT INTO
    `users` (
        `username`,
        `password`,
        `roleid`
    )
SELECT *
FROM (
        SELECT
            "admin" AS `username`,
            "$2b$10$zuXkXEL5UJnEUMYiFYYHYurgr9syHl8txgev3Rkts5leOF2EIhurC" AS `password_encrypted`, (
                SELECT `id`
                FROM `roles`
                WHERE
                    `label` = "admin"
                LIMIT
                    1
            ) AS `roleid`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `username`
        FROM `users`
        WHERE
            `username` = 'admin'
    )
LIMIT 1;

INSERT INTO
    `users` (`username`, `password`)
SELECT *
FROM (
        SELECT
            "user" AS `username`,
            "$2b$10$s.FMAuaBJ97wYB1FkmOQAuCkiDEoZmZ1fsEGCwQdZWdKEib.Tspb2" AS `password_encrypted`, (
                SELECT `id`
                FROM `roles`
                WHERE
                    `label` = "user"
                LIMIT
                    1
            ) AS `roleid`
    ) AS `temp`
WHERE NOT EXISTS (
        SELECT `username`
        FROM `users`
        WHERE
            `username` = 'user'
    )
LIMIT 1;