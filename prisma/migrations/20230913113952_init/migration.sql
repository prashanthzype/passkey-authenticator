-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_uid_key`(`uid`),
    UNIQUE INDEX `User_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authenticator` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `credentialId` VARCHAR(191) NOT NULL,
    `algorithm` VARCHAR(191) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,
    `osType` VARCHAR(191) NOT NULL,
    `authenticationType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Challenge` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL,
    `challenge` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `origin` VARCHAR(191) NOT NULL,
    `payload` VARCHAR(191) NOT NULL,
    `osType` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL,
    `authStatus` BOOLEAN NOT NULL,
    `authenticationType` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Challenge_challenge_key`(`challenge`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Challenge` ADD CONSTRAINT `Challenge_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
