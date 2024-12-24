/*
  Warnings:

  - You are about to drop the column `weekend` on the `LaborCalendar` table. All the data in the column will be lost.
  - Added the required column `disabled` to the `LaborCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disabled` to the `WakeupCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LaborCalendar" DROP COLUMN "weekend",
ADD COLUMN     "disabled" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "WakeupCalendar" ADD COLUMN     "disabled" BOOLEAN NOT NULL;
