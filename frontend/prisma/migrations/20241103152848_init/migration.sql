-- CreateTable
CREATE TABLE "WakeupCalendar" (
    "id" SERIAL NOT NULL,
    "student" TEXT NOT NULL,

    CONSTRAINT "WakeupCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaborCalendar" (
    "id" SERIAL NOT NULL,
    "student" TEXT NOT NULL,

    CONSTRAINT "LaborCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Date" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "wakeupCalendarId" INTEGER,
    "laborCalendarId" INTEGER,

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WakeupCalendar_student_key" ON "WakeupCalendar"("student");

-- CreateIndex
CREATE UNIQUE INDEX "LaborCalendar_student_key" ON "LaborCalendar"("student");

-- CreateIndex
CREATE UNIQUE INDEX "Date_year_month_day_key" ON "Date"("year", "month", "day");

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_wakeupCalendarId_fkey" FOREIGN KEY ("wakeupCalendarId") REFERENCES "WakeupCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_laborCalendarId_fkey" FOREIGN KEY ("laborCalendarId") REFERENCES "LaborCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
