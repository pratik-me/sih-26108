console.log("RUNTIME PROCESS.ENV CHECK:", {
  NODE_ENV: process.env.NODE_ENV,
  HAS_JWT_SECRET: Boolean(process.env.JWT_SECRET),
  AVAILABLE_KEYS: Object.keys(process.env).filter(
    (k) => !k.startsWith("npm_") && !k.startsWith("__"),
  ),
});

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

if (process.env.NODE_ENV !== "production") {
  const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../../../.env"),
    path.resolve(__dirname, "../../.env"),
  ];
  const foundPath = possiblePaths.find((p) => fs.existsSync(p));
  if (foundPath) {
    dotenv.config({ path: foundPath });
  }
}

import { configurePrismaEngine } from "./common/prisma-engine";

// Configure Prisma Engine immediately on process startup
configurePrismaEngine();

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

let cachedApp: INestApplication | null = null;

async function bootstrap(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  // Ensure engine is configured before any Nest services initialize
  configurePrismaEngine();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle("Manak Setu AI (Manak Setu Procurement Edition) API")
    .setDescription(
      "SIH 26108: AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Public Procurement Specifications & GFR 144(i) Compliance",
    )
    .setVersion("2.0.0")
    .addBearerAuth()
    .addTag("Authentication")
    .addTag("Procurement & Tender Compliance")
    .addTag("Indian Standards")
    .addTag("Certification")
    .addTag("Testing & Pre-Dispatch Inspection")
    .addTag("Laboratories")
    .addTag("Chat & AI Assistant")
    .addTag("RAG Retrieval")
    .addTag("Procurement Compliance Dossiers")
    .addTag("Analytics")
    .addTag("Admin")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NETLIFY ||
      process.env.SERVERLESS,
  );

  await app.init();
  cachedApp = app;

  if (!isServerless) {
    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || "0.0.0.0";
    await app.listen(port, host);
    console.log(
      `🚀 Manak Setu AI API running on http://${host === "0.0.0.0" ? "localhost" : host}:${port}/api/v1`,
    );
    console.log(
      `📚 Swagger documentation available at http://${host === "0.0.0.0" ? "localhost" : host}:${port}/api/docs`,
    );

    // Log detected LLM Configuration
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const mistralKey = process.env.MISTRAL_API_KEY;

    console.log("--------------------------------------------------");
    console.log(
      `[LLM Status] Configured Provider: ${process.env.LLM_PROVIDER || "(auto-detect)"}`,
    );
    if (openrouterKey && !openrouterKey.includes("your_openrouter_key")) {
      console.log(
        `[LLM Status] \x1b[32m✔ OpenRouter Connected\x1b[0m | Model: ${process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free"}`,
      );
    } else if (openaiKey && !openaiKey.includes("your_openai_api_key_here")) {
      console.log(
        `[LLM Status] \x1b[32m✔ OpenAI Connected\x1b[0m | Model: ${process.env.OPENAI_MODEL || "gpt-4o-mini"}`,
      );
    } else if (geminiKey && !geminiKey.includes("your_")) {
      console.log(
        `[LLM Status] \x1b[32m✔ Google Gemini Connected\x1b[0m | Model: ${process.env.LLM_MODEL || "gemini-1.5-flash"}`,
      );
    } else if (
      anthropicKey &&
      !anthropicKey.includes("your_anthropic_api_key_here")
    ) {
      console.log(
        `[LLM Status] \x1b[32m✔ Anthropic Connected\x1b[0m | Model: ${process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022"}`,
      );
    } else if (mistralKey && !mistralKey.includes("your_")) {
      console.log(
        `[LLM Status] \x1b[32m✔ Mistral Connected\x1b[0m | Model: ${process.env.MISTRAL_MODEL || "mistral-large-latest"}`,
      );
    } else {
      console.log(
        `[LLM Status] \x1b[33m⚠ No Cloud LLM Keys Detected\x1b[0m | Using 100% Free Offline Deterministic Grounding Engine`,
      );
    }
    console.log("--------------------------------------------------");
  }

  return cachedApp;
}

const isServerless = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NETLIFY ||
    process.env.SERVERLESS,
);

// For standalone / server / container environments
if (!isServerless) {
  bootstrap().catch((err) => {
    console.error("Fatal error during API bootstrap:", err);
    process.exit(1);
  });
}

// For serverlessenvironments
async function handler(req: any, res: any) {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}

export default handler;
