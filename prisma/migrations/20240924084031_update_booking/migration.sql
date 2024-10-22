/*
  Warnings:

  - Added the required column `payment_method` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `is_paid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `payment_method` ENUM('cash', 'credit_card', 'qr_code') NOT NULL,
    ADD COLUMN `status` ENUM('pending', 'cancelled', 'check_in', 'check_out') NOT NULL DEFAULT 'pending';
