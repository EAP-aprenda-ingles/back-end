-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "categoriesId" INTEGER NOT NULL,
    "articleCover" TEXT NOT NULL,
    CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Files_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Preferences" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Files" ("articleCover", "categoriesId", "coverUrl", "createdAt", "description", "id", "title", "userId") SELECT "articleCover", "categoriesId", "coverUrl", "createdAt", "description", "id", "title", "userId" FROM "Files";
DROP TABLE "Files";
ALTER TABLE "new_Files" RENAME TO "Files";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
