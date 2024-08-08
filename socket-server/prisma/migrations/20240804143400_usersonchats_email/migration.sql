/*
  Warnings:

  - The primary key for the `UsersOnChats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UsersOnChats` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `UsersOnChats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersOnChats" DROP CONSTRAINT "UsersOnChats_userId_fkey";

-- AlterTable
ALTER TABLE "UsersOnChats" DROP CONSTRAINT "UsersOnChats_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD CONSTRAINT "UsersOnChats_pkey" PRIMARY KEY ("userEmail", "chatID");

-- AddForeignKey
ALTER TABLE "UsersOnChats" ADD CONSTRAINT "UsersOnChats_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
