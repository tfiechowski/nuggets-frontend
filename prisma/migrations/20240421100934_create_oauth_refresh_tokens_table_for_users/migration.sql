-- CreateTable
CREATE TABLE "UserGoogleOAuthRefreshTokens" (
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGoogleOAuthRefreshTokens_userId_key" ON "UserGoogleOAuthRefreshTokens"("userId");
