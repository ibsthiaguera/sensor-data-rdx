/*
  Warnings:

  - You are about to drop the column `name` on the `sensor_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sensor_data" DROP COLUMN "name",
ALTER COLUMN "timestamp" DROP NOT NULL,
ALTER COLUMN "value" DROP NOT NULL;
