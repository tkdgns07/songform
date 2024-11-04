/*
  Warnings:

  - Added the required column `song` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `song` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LaborCalendar" ADD COLUMN     "song" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WakeupCalendar" ADD COLUMN     "song" TEXT NOT NULL;
