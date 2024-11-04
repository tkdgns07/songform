/*
  Warnings:

  - You are about to drop the column `date` on the `LaborCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `WakeupCalendar` table. All the data in the column will be lost.
  - Added the required column `day` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LaborCalendar" DROP COLUMN "date",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WakeupCalendar" DROP COLUMN "date",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
