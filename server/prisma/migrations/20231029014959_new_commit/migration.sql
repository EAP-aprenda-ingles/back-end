-- CreateTable
CREATE TABLE "Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PreferencesToUsers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PreferencesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PreferencesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PreferencesToUsers_AB_unique" ON "_PreferencesToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PreferencesToUsers_B_index" ON "_PreferencesToUsers"("B");
