-- CreateTable
CREATE TABLE `RentalPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` DOUBLE NOT NULL,
    `room_type_id` INTEGER NOT NULL,
    `type_rental` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `special_request` VARCHAR(191) NULL,
    `total_price` DOUBLE NOT NULL,
    `start_date_time` DATETIME(3) NOT NULL,
    `room_type_id` INTEGER NOT NULL,
    `rental_price_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomTypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hotel_id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amenity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_type_id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_type_id` INTEGER NOT NULL,
    `image_link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalPrice` ADD CONSTRAINT `RentalPrice_room_type_id_fkey` FOREIGN KEY (`room_type_id`) REFERENCES `RoomTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_room_type_id_fkey` FOREIGN KEY (`room_type_id`) REFERENCES `RoomTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_rental_price_id_fkey` FOREIGN KEY (`rental_price_id`) REFERENCES `RentalPrice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomTypes` ADD CONSTRAINT `RoomTypes_hotel_id_fkey` FOREIGN KEY (`hotel_id`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amenity` ADD CONSTRAINT `Amenity_room_type_id_fkey` FOREIGN KEY (`room_type_id`) REFERENCES `RoomTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_room_type_id_fkey` FOREIGN KEY (`room_type_id`) REFERENCES `RoomTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
