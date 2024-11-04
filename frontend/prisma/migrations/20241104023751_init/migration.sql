/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Students` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LaborCalendar_student_key";

-- DropIndex
DROP INDEX "WakeupCalendar_student_key";

-- CreateIndex
CREATE UNIQUE INDEX "Students_id_key" ON "Students"("id");
