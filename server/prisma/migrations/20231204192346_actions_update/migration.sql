-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "line" INTEGER NOT NULL DEFAULT 0,
    "categoriesId" INTEGER NOT NULL,
    "fileActionsId" TEXT NOT NULL,
    CONSTRAINT "Actions_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Actions_fileActionsId_fkey" FOREIGN KEY ("fileActionsId") REFERENCES "FileActions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Actions" ("categoriesId", "fileActionsId", "id", "word") SELECT "categoriesId", "fileActionsId", "id", "word" FROM "Actions";
DROP TABLE "Actions";
ALTER TABLE "new_Actions" RENAME TO "Actions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
