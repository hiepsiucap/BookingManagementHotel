/*
  Warnings:

  - You are about to drop the column `room_type_id` on the `Amenity` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Amenity_room_type_id_fkey` ON `Amenity`;

-- AlterTable
ALTER TABLE `Amenity` DROP COLUMN `room_type_id`;
