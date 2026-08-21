-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "fullDesc" TEXT NOT NULL DEFAULT '',
    "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "procedure" TEXT NOT NULL DEFAULT '',
    "recoveryTime" TEXT NOT NULL DEFAULT '',
    "durationMins" INTEGER NOT NULL DEFAULT 60,
    "price" DECIMAL(10,2),
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Specialist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "specialistId" TEXT,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openTime" TEXT NOT NULL DEFAULT '09:00',
    "closeTime" TEXT NOT NULL DEFAULT '18:00',
    "breakStart" TEXT,
    "breakEnd" TEXT,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Holiday',

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "slotIntervalMins" INTEGER NOT NULL DEFAULT 60,
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://www.instagram.com/glowvie_lounge',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Appointment_date_status_idx" ON "Appointment"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_weekday_key" ON "WorkingHours"("weekday");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_date_key" ON "Holiday"("date");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
