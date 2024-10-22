-- DropForeignKey
ALTER TABLE `Amenity` DROP FOREIGN KEY `Amenity_room_type_id_fkey`;

-- CreateTable
CREATE TABLE `RoomAmenity` (
    `room_id` INTEGER NOT NULL,
    `amenity_id` INTEGER NOT NULL,

    PRIMARY KEY (`room_id`, `amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomAmenity` ADD CONSTRAINT `RoomAmenity_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `RoomTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomAmenity` ADD CONSTRAINT `RoomAmenity_amenity_id_fkey` FOREIGN KEY (`amenity_id`) REFERENCES `Amenity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
