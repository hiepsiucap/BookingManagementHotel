-- AlterTable
ALTER TABLE `Booking` MODIFY `status` ENUM('pending', 'cancelled', 'check_in', 'Confirmed', 'check_out') NOT NULL DEFAULT 'pending';
