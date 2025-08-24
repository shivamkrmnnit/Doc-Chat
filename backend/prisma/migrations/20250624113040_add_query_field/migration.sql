/*
  Warnings:

  - You are about to drop the column `answer` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `History` table. All the data in the column will be lost.
  - Added the required column `query` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "answer",
DROP COLUMN "question",
ADD COLUMN     "query" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;
