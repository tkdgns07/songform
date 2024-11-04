/*
  Warnings:

  - You are about to drop the column `day` on the `LaborCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `LaborCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `LaborCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `WakeupCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `WakeupCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `WakeupCalendar` table. All the data in the column will be lost.
  - Added the required column `date` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LaborCalendar" DROP COLUMN "day",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "WakeupCalendar" DROP COLUMN "day",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Students" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "birthday" JSONB NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);
