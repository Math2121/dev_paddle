-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paddle_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loggers" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "paddle_id" TEXT NOT NULL,
    "price_id" TEXT,
    "product_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paddle_id" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "paddle_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_paddle_id_key" ON "customer"("paddle_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_customer_id_key" ON "subscription"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_paddle_id_key" ON "subscription"("paddle_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_paddle_id_key" ON "product"("paddle_id");

-- CreateIndex
CREATE UNIQUE INDEX "price_paddle_id_key" ON "price"("paddle_id");
