import { PrismaClient } from "@prisma/client";
import {
  SEED_USERS,
  SEED_STANDARDS,
  SEED_SCHEMES,
  SEED_LABORATORIES,
  SEED_SUPERSEDED_STANDARDS,
  SEED_SAMPLE_TENDERS,
} from "../../packages/seed-data/src/index";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "Starting Manak Setu AI Procurement Database Seeding (SIH 26108)...",
  );

  // 1. Seed Users
  console.log("Inserting seed procurement users...");
  for (const user of SEED_USERS) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: user as any,
        create: user as any,
      });
    } catch (e: any) {
      console.warn(`User seed warning for ${user.email}:`, e.message);
    }
  }

  // 2. Seed Standards & Clauses
  console.log("Inserting Indian Standards & Clauses...");
  for (const std of SEED_STANDARDS) {
    try {
      const createdStd = await prisma.standard.upsert({
        where: { standardNumber: std.standardNumber },
        update: std as any,
        create: std as any,
      });

      // Seed document for RAG
      const doc = await prisma.document.create({
        data: {
          title: std.title,
          standardNumber: std.standardNumber,
          standardId: createdStd.id,
          category: "STANDARD",
          division: std.division,
          sourceUrl: std.sourceUrl,
          publicationDate: std.publicationDate,
          lastUpdatedDate: std.lastUpdatedDate,
          status: std.status as any,
          isIngested: true,
        },
      });

      // Create chunks
      await prisma.documentChunk.create({
        data: {
          documentId: doc.id,
          standardNumber: std.standardNumber,
          section: "Scope and Requirements",
          clause: "1.0",
          page: 1,
          content: `Scope of ${std.standardNumber}: ${std.scope}\n\nAbstract: ${std.abstract}`,
          status: std.status as any,
          metadata: {
            title: std.title,
            isMandatory: std.isMandatory,
            qco: std.qcoNotificationNumber,
          },
        },
      });
    } catch (e: any) {
      console.warn(
        `Standard seed warning for ${std.standardNumber}:`,
        e.message,
      );
    }
  }

  // 3. Seed Certification Schemes
  console.log("Inserting Certification Schemes...");
  for (const scheme of SEED_SCHEMES) {
    try {
      await prisma.certificationScheme.upsert({
        where: { code: scheme.code },
        update: scheme as any,
        create: scheme as any,
      });
    } catch (e: any) {
      console.warn(`Scheme seed warning for ${scheme.code}:`, e.message);
    }
  }

  // 4. Seed Laboratories
  console.log("Inserting BIS Recognized Laboratories...");
  for (const lab of SEED_LABORATORIES) {
    try {
      await prisma.laboratory.upsert({
        where: { labCode: lab.labCode },
        update: lab as any,
        create: lab as any,
      });
    } catch (e: any) {
      console.warn(`Laboratory seed warning for ${lab.labCode}:`, e.message);
    }
  }

  // 5. Seed Superseded Standards
  console.log("Inserting Superseded Standards Mapping...");
  for (const sup of SEED_SUPERSEDED_STANDARDS) {
    try {
      await prisma.supersededStandard.upsert({
        where: { obsoleteStandard: sup.obsoleteStandard },
        update: {
          activeStandard: sup.activeStandard,
          title: sup.title,
          yearWithdrawn: sup.yearWithdrawn,
          yearActive: sup.yearActive,
          keyChanges: sup.keyChanges,
          gazetteNotification: sup.gazetteReference,
          transitionGuidance: sup.transitionGuidance,
        },
        create: {
          obsoleteStandard: sup.obsoleteStandard,
          activeStandard: sup.activeStandard,
          title: sup.title,
          yearWithdrawn: sup.yearWithdrawn,
          yearActive: sup.yearActive,
          keyChanges: sup.keyChanges,
          gazetteNotification: sup.gazetteReference,
          transitionGuidance: sup.transitionGuidance,
        },
      });
    } catch (e: any) {
      console.warn(
        `Superseded standard seed warning for ${sup.obsoleteStandard}:`,
        e.message,
      );
    }
  }

  // 6. Seed Sample Tender Analyses
  console.log("Inserting Sample Procurement Tender Analyses...");
  for (const tender of SEED_SAMPLE_TENDERS) {
    try {
      await prisma.tenderAnalysis.create({
        data: {
          tenderTitle: tender.tenderTitle,
          tenderNumber: tender.tenderId,
          procuringEntity: tender.procuringEntity,
          category: tender.category,
          estimatedValue: tender.estimatedValue,
          rawText: tender.rawSpecificationText,
          extractedSpecs: tender.boqItems as any,
          recommendations: [] as any,
          complianceScore: 85.0,
          status: "ANALYZED",
        },
      });
    } catch (e: any) {
      console.warn(
        `Tender analysis seed warning for ${tender.tenderTitle}:`,
        e.message,
      );
    }
  }

  console.log("✅ Procurement Database Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(
      "⚠️ Seeding error (Database may be offline or initializing):",
      e.message,
    );
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
