-- CreateTable
CREATE TABLE "QuestionFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctrineFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "doctrineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctrineFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerseFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerseFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionFavorite_userId_idx" ON "QuestionFavorite"("userId");

-- CreateIndex
CREATE INDEX "QuestionFavorite_questionId_idx" ON "QuestionFavorite"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionFavorite_userId_questionId_key" ON "QuestionFavorite"("userId", "questionId");

-- CreateIndex
CREATE INDEX "DoctrineFavorite_userId_idx" ON "DoctrineFavorite"("userId");

-- CreateIndex
CREATE INDEX "DoctrineFavorite_doctrineId_idx" ON "DoctrineFavorite"("doctrineId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctrineFavorite_userId_doctrineId_key" ON "DoctrineFavorite"("userId", "doctrineId");

-- CreateIndex
CREATE INDEX "VerseFavorite_userId_idx" ON "VerseFavorite"("userId");

-- CreateIndex
CREATE INDEX "VerseFavorite_verseId_idx" ON "VerseFavorite"("verseId");

-- CreateIndex
CREATE UNIQUE INDEX "VerseFavorite_userId_verseId_key" ON "VerseFavorite"("userId", "verseId");

-- AddForeignKey
ALTER TABLE "QuestionFavorite" ADD CONSTRAINT "QuestionFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionFavorite" ADD CONSTRAINT "QuestionFavorite_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctrineFavorite" ADD CONSTRAINT "DoctrineFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctrineFavorite" ADD CONSTRAINT "DoctrineFavorite_doctrineId_fkey" FOREIGN KEY ("doctrineId") REFERENCES "Doctrine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseFavorite" ADD CONSTRAINT "VerseFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseFavorite" ADD CONSTRAINT "VerseFavorite_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "DailyVerse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
