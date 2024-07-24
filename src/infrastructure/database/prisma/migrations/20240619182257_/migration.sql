-- CreateTable
CREATE TABLE "history_credit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creditAmount" DOUBLE PRECISION NOT NULL,
    "renewAt" TIMESTAMP(3) NOT NULL,
    "expirationAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_credit_pkey" PRIMARY KEY ("id")
);
