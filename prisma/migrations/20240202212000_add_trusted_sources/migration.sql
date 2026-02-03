-- Create enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TrustedSourceType') THEN
    CREATE TYPE "TrustedSourceType" AS ENUM ('YOUTUBE_CHANNEL', 'WEBSITE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TrustTier') THEN
    CREATE TYPE "TrustTier" AS ENUM ('HIGH', 'REVIEW_REQUIRED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SuggestedStatus') THEN
    CREATE TYPE "SuggestedStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SAVED_FOR_LATER');
  END IF;
END $$;

-- Create TrustedSource table
CREATE TABLE IF NOT EXISTS "TrustedSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "TrustedSourceType" NOT NULL,
  "trustTier" "TrustTier" NOT NULL DEFAULT 'HIGH',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "channelId" TEXT,
  "baseUrl" TEXT,
  "contentTypesAllowed" TEXT[] NOT NULL,
  "ageMin" INTEGER NOT NULL DEFAULT 5,
  "ageMax" INTEGER NOT NULL DEFAULT 7,
  "maxVideoMinutes" INTEGER NOT NULL DEFAULT 12,
  "requireKeywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "blockKeywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrustedSource_pkey" PRIMARY KEY ("id")
);

-- Create SuggestedResource table
CREATE TABLE IF NOT EXISTS "SuggestedResource" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "subtopicId" TEXT,
  "trustedSourceId" TEXT NOT NULL,
  "type" "ResourceType" NOT NULL,
  "url" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "durationMin" INTEGER,
  "summary" TEXT,
  "reason" TEXT NOT NULL,
  "status" "SuggestedStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedBy" TEXT,
  CONSTRAINT "SuggestedResource_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SuggestedResource_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "SuggestedResource_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "SuggestedResource_trustedSourceId_fkey" FOREIGN KEY ("trustedSourceId") REFERENCES "TrustedSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SuggestedResource_topicId_idx" ON "SuggestedResource"("topicId");
CREATE INDEX IF NOT EXISTS "SuggestedResource_subtopicId_idx" ON "SuggestedResource"("subtopicId");
CREATE INDEX IF NOT EXISTS "SuggestedResource_trustedSourceId_idx" ON "SuggestedResource"("trustedSourceId");
