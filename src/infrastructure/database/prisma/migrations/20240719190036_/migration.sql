/*
  Warnings:

  - Added the required column `paddle_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "paddle_id" TEXT NOT NULL;
