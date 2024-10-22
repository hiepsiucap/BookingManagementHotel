/*
  Warnings:

  - Added the required column `end_date_time` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `check_out_time` DATETIME(3) NULL,
    ADD COLUMN `end_date_time` DATETIME(3) NOT NULL;
