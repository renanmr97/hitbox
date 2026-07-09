/*
  Warnings:

  - You are about to drop the column `wikipedia_url` on the `games` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[igdb_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[igdb_id]` on the table `platforms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('CONSOLE', 'ARCADE', 'PLATFORM', 'OPERATING_SYSTEM', 'PORTABLE_CONSOLE', 'COMPUTER');

-- AlterTable
ALTER TABLE "games" DROP COLUMN "wikipedia_url",
ADD COLUMN     "igdb_id" INTEGER;

-- AlterTable
ALTER TABLE "platforms" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "generation" INTEGER,
ADD COLUMN     "igdb_id" INTEGER,
ADD COLUMN     "platform_type" "PlatformType";

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "igdb_id" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_genres" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,

    CONSTRAINT "game_genres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "genres_igdb_id_key" ON "genres"("igdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_genres_game_id_genre_id_key" ON "game_genres"("game_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "games_igdb_id_key" ON "games"("igdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_igdb_id_key" ON "platforms"("igdb_id");

-- AddForeignKey
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_genres" ADD CONSTRAINT "game_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
