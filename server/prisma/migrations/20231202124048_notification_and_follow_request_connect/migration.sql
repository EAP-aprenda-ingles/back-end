-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "happenedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followReqId" INTEGER,
    "deletedAt" DATETIME,
    CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notifications_followReqId_fkey" FOREIGN KEY ("followReqId") REFERENCES "FollowRequests" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Notifications" ("content", "deletedAt", "happenedAt", "id", "type", "userId") SELECT "content", "deletedAt", "happenedAt", "id", "type", "userId" FROM "Notifications";
DROP TABLE "Notifications";
ALTER TABLE "new_Notifications" RENAME TO "Notifications";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
