-- CreateTable
CREATE TABLE "Followers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "followerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
