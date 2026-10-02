/*
  Warnings:

  - The values [SCHEME_HALLMARK,HALLMARKING] on the enum `CertificationSchemeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `hallmarking_centres` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CertificationSchemeType_new" AS ENUM ('SCHEME_I_ISI', 'SCHEME_II_CRS', 'SCHEME_III_COPC', 'SCHEME_IV_COPC_PROCESS', 'SCHEME_IV_COC', 'SCHEME_V_MANAGEMENT_PROCESS', 'SCHEME_VI_SUPPLIER_DECLARATION', 'SCHEME_VII_PILOT_PRODUCTION', 'SCHEME_VIII_CUSTOM_IMPORT', 'SCHEME_IX_ECO_MARK', 'SCHEME_ECO_MARK', 'SCHEME_X_FOREIGN_MANUFACTURERS', 'SCHEME_FMCS', 'MANAGEMENT_SYSTEMS_MSCS', 'LABORATORY_RECOGNITION_LRS');
ALTER TABLE "certification_schemes" ALTER COLUMN "schemeType" TYPE "CertificationSchemeType_new" USING ("schemeType"::text::"CertificationSchemeType_new");
ALTER TYPE "CertificationSchemeType" RENAME TO "CertificationSchemeType_old";
ALTER TYPE "CertificationSchemeType_new" RENAME TO "CertificationSchemeType";
DROP TYPE "CertificationSchemeType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'PROCUREMENT_OFFICER';
ALTER TYPE "UserRole" ADD VALUE 'BUYER_GEM';
ALTER TYPE "UserRole" ADD VALUE 'QA_ENGINEER';
ALTER TYPE "UserRole" ADD VALUE 'BIDDER_SUPPLIER';
COMMIT;

-- AlterTable
ALTER TABLE "chat_sessions" ALTER COLUMN "roleMode" SET DEFAULT 'PROCUREMENT_OFFICER';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PROCUREMENT_OFFICER';

-- DropTable
DROP TABLE "hallmarking_centres";

-- CreateTable
CREATE TABLE "tender_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tenderTitle" TEXT NOT NULL,
    "tenderNumber" TEXT,
    "procuringEntity" TEXT,
    "category" TEXT,
    "estimatedValue" TEXT,
    "rawText" TEXT NOT NULL,
    "extractedSpecs" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "gfrAudit" JSONB,
    "complianceScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ANALYZED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tender_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_audits" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT,
    "tenderTitle" TEXT,
    "specText" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "isCompliant" BOOLEAN NOT NULL,
    "violations" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "superseded_standards" (
    "id" TEXT NOT NULL,
    "obsoleteStandard" TEXT NOT NULL,
    "activeStandard" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "yearWithdrawn" INTEGER NOT NULL,
    "yearActive" INTEGER NOT NULL,
    "keyChanges" JSONB NOT NULL,
    "gazetteNotification" TEXT,
    "transitionGuidance" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "superseded_standards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tender_analyses_tenderTitle_idx" ON "tender_analyses"("tenderTitle");

-- CreateIndex
CREATE INDEX "tender_analyses_userId_idx" ON "tender_analyses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "superseded_standards_obsoleteStandard_key" ON "superseded_standards"("obsoleteStandard");

-- CreateIndex
CREATE INDEX "superseded_standards_obsoleteStandard_idx" ON "superseded_standards"("obsoleteStandard");

-- CreateIndex
CREATE INDEX "superseded_standards_activeStandard_idx" ON "superseded_standards"("activeStandard");

-- AddForeignKey
ALTER TABLE "tender_analyses" ADD CONSTRAINT "tender_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
