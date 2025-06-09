/*
  Warnings:

  - You are about to drop the column `firstNmae` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastNmae` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstNmae",
DROP COLUMN "lastNmae",
ADD COLUMN     "firstName" VARCHAR(35) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(35) NOT NULL;
