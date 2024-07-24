-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT,
    "card_name" TEXT,
    "card_brand" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
