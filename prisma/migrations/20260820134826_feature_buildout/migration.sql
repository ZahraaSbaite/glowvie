-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "importantNotes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "prepInfo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "ServiceSpecialist" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,

    CONSTRAINT "ServiceSpecialist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffWorkingHours" (
    "id" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openTime" TEXT NOT NULL DEFAULT '09:00',
    "closeTime" TEXT NOT NULL DEFAULT '18:00',
    "breakStart" TEXT,
    "breakEnd" TEXT,

    CONSTRAINT "StaffWorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedSlot" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "specialistId" TEXT,
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Promotion',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "originalPrice" DECIMAL(10,2),
    "promoPrice" DECIMAL(10,2),
    "validUntil" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "beforeUrl" TEXT NOT NULL DEFAULT '',
    "afterUrl" TEXT NOT NULL DEFAULT '',
    "isBeforeAfter" BOOLEAN NOT NULL DEFAULT false,
    "consentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSpecialist_serviceId_specialistId_key" ON "ServiceSpecialist"("serviceId", "specialistId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffWorkingHours_specialistId_weekday_key" ON "StaffWorkingHours"("specialistId", "weekday");

-- CreateIndex
CREATE INDEX "BlockedSlot_date_specialistId_idx" ON "BlockedSlot"("date", "specialistId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "Appointment_specialistId_date_status_idx" ON "Appointment"("specialistId", "date", "status");

-- AddForeignKey
ALTER TABLE "ServiceSpecialist" ADD CONSTRAINT "ServiceSpecialist_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSpecialist" ADD CONSTRAINT "ServiceSpecialist_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffWorkingHours" ADD CONSTRAINT "StaffWorkingHours_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedSlot" ADD CONSTRAINT "BlockedSlot_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
