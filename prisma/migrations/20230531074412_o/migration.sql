/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invitation_phoneNumber_key" ON "Invitation"("phoneNumber");
