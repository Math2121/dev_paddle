/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT,
    "card_name" TEXT,
    "card_brand" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
