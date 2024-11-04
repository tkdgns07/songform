/*
  Warnings:

  - You are about to drop the column `song` on the `LaborCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `song` on the `WakeupCalendar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LaborCalendar" DROP COLUMN "song",
ADD COLUMN     "music_url" TEXT NOT NULL DEFAULT 'None';

-- AlterTable
ALTER TABLE "WakeupCalendar" DROP COLUMN "song",
ADD COLUMN     "music_url" TEXT NOT NULL DEFAULT 'None';
