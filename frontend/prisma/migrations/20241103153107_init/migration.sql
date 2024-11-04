/*
  Warnings:

  - You are about to drop the `Date` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `day` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Date" DROP CONSTRAINT "Date_laborCalendarId_fkey";

-- DropForeignKey
ALTER TABLE "Date" DROP CONSTRAINT "Date_wakeupCalendarId_fkey";

-- AlterTable
ALTER TABLE "LaborCalendar" ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WakeupCalendar" ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Date";
