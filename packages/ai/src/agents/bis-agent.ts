import {
  AgentExecutionResponse,
  ConfidenceLevel,
  Evidence,
  IndianLanguage,
  QueryIntent,
  ToolName,
} from "@bis/shared-types";
import { CitationBuilder } from "../citations/citation-builder";
import { GroundingValidator } from "../grounding/grounding-validator";
import { ILLMProvider } from "../providers/llm.provider";
import { IndicLanguageEngine } from "../providers/translation.provider";
import { BIS_SYSTEM_PROMPT } from "../prompts/bis-prompts";
import { tool } from "@langchain/core/tools";
import { StateGraph, Annotation, END } from "@langchain/langgraph";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { z } from "zod";

export interface BISAgentToolsHandler {
  executeTool(
    tool: ToolName,
    args: Record<string, unknown>,
  ): Promise<{ data: unknown; evidence: Evidence[] }>;
}

const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  evidence: Annotation<Evidence[]>({
    reducer: (x, y) => {
      const existingIds = new Set(x.map((e) => e.id));
      const filteredNew = y.filter((e) => !existingIds.has(e.id));
      return [...x, ...filteredNew];
    },
    default: () => [],
  }),
});

export class BISSaarthiAgent {
  private citationBuilder = new CitationBuilder();
  private groundingValidator = new GroundingValidator();
  private languageEngine = new IndicLanguageEngine();

  constructor(
    private llmProvider: ILLMProvider,
    private toolsHandler?: BISAgentToolsHandler,
  ) {}

  private getChatModel(): BaseChatModel | null {
    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    if (provider === "deterministic") return null;

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const hasValidOpenRouter =
      openrouterKey &&
      !openrouterKey.includes("your_openrouter_key") &&
      openrouterKey.trim().length > 10;
    const hasValidAnthropic =
      anthropicKey &&
      !anthropicKey.includes("your_anthropic_api_key_here") &&
      anthropicKey.trim().length > 10;
    const hasValidOpenAI =
      openaiKey &&
      !openaiKey.includes("your_openai_api_key_here") &&
      openaiKey.trim().length > 10;

    if (
      provider === "openrouter" ||
      (hasValidOpenRouter && provider !== "anthropic" && provider !== "openai")
    ) {
      if (!hasValidOpenRouter) return null;
      return new ChatOpenAI({
        modelName:
          process.env.OPENROUTER_MODEL ||
          "nvidia/nemotron-3-super-120b-a12b:free",
        openAIApiKey: openrouterKey,
        temperature: 0.5,
        configuration: {
          baseURL:
            process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer":
              process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
            "X-Title": process.env.OPENROUTER_SITE_NAME || "Manak Setu AI",
          },
        },
      }) as unknown as BaseChatModel;
    }

    if (
      provider === "anthropic" ||
      (hasValidAnthropic && provider !== "openai")
    ) {
      if (!hasValidAnthropic) return null;
      return new ChatAnthropic({
        modelName: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
        apiKey: anthropicKey,
        temperature: 0.5,
      }) as unknown as BaseChatModel;
    }

    if (provider === "openai" || hasValidOpenAI) {
      if (!hasValidOpenAI) return null;
      return new ChatOpenAI({
        modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
        openAIApiKey: openaiKey,
        temperature: 0.5,
      }) as unknown as BaseChatModel;
    }

    return null;
  }

  /**
   * Classify user query intent for Public Procurement & BIS Compliance (SIH 26108).
   */
  classifyIntent(query: string): QueryIntent {
    const q = query.toLowerCase();

    if (
      q.includes("tender") ||
      q.includes("boq") ||
      q.includes("procurement") ||
      q.includes("bid") ||
      q.includes("gem") ||
      q.includes("cppp") ||
      q.includes("rfp")
    ) {
      return QueryIntent.TENDER_ANALYSIS;
    }
    if (
      q.includes("gfr") ||
      q.includes("rule 144") ||
      q.includes("discriminat") ||
      q.includes("brand bias") ||
      q.includes("restrictive") ||
      q.includes("proprietary") ||
      q.includes("make in india")
    ) {
      return QueryIntent.GFR_COMPLIANCE_AUDIT;
    }
    if (
      q.includes("supersede") ||
      q.includes("obsolete") ||
      q.includes("withdrawn") ||
      q.includes("is 800:1984") ||
      q.includes("is 456:1978") ||
      q.includes("is 1786:1985") ||
      q.includes("is 4984:1995") ||
      q.includes("is 10500:1991") ||
      q.includes("replaced by")
    ) {
      return QueryIntent.SUPERSEDED_STANDARD_CHECK;
    }
    if (
      q.includes("pdi") ||
      q.includes("pre-dispatch") ||
      q.includes("inspection schedule") ||
      q.includes("lot inspection") ||
      q.includes("sampling plan") ||
      q.includes("tpia") ||
      q.includes("rites")
    ) {
      return QueryIntent.PDI_INSPECTION_SCHEDULE;
    }
    if (
      q.includes("qco") ||
      q.includes("quality control order") ||
      q.includes("gazette") ||
      q.includes("mandatory order") ||
      q.includes("statutory")
    ) {
      return QueryIntent.QCO_LEGAL_MANDATE;
    }
    if (
      q.includes("clause") ||
      q.includes("explain clause") ||
      q.includes("clause 5") ||
      q.includes("clause 4")
    ) {
      return QueryIntent.CLAUSE_EXPLANATION;
    }
    if (
      q.includes("test") ||
      q.includes("sampling") ||
      q.includes("test method") ||
      q.includes("routine test")
    ) {
      return QueryIntent.TESTING_REQUIREMENTS;
    }
    if (
      q.includes("laboratory") ||
      q.includes("lab") ||
      q.includes("nabl") ||
      q.includes("where to test") ||
      q.includes("testing centre")
    ) {
      return QueryIntent.LABORATORY_LOOKUP;
    }
    if (
      q.includes("certif") ||
      q.includes("scheme") ||
      q.includes("licence") ||
      q.includes("license") ||
      q.includes("crs") ||
      q.includes("fmcs")
    ) {
      return QueryIntent.CERTIFICATION_GUIDANCE;
    }
    if (q.includes("compare") || q.includes("difference between")) {
      return QueryIntent.COMPARE_STANDARDS;
    }
    if (
      q.includes("standard") ||
      q.includes("which is") ||
      q.includes("applicable") ||
      q.includes("pipe") ||
      q.includes("inverter") ||
      q.includes("solar") ||
      q.includes("steel") ||
      q.includes("cement") ||
      q.includes("luminaire")
    ) {
      return QueryIntent.PROCUREMENT_STANDARD_RECOMMENDATION;
    }

    return QueryIntent.GENERAL_BIS_INFO;
  }

  /**
   * Multi-step Agent Execution using LangGraph StateGraph (when real model available)
   * or single-tool intent execution (when deterministic mode active).
   */
  async execute(
    query: string,
    preferredLanguage?: IndianLanguage,
  ): Promise<AgentExecutionResponse> {
    const detectedLang =
      preferredLanguage || (await this.languageEngine.detectLanguage(query));
    const { translatedText, preservedEntities } =
      await this.languageEngine.translateToEnglish(query, detectedLang);
    const intent = this.classifyIntent(translatedText);

    const model = this.getChatModel();

    if (model && this.toolsHandler) {
      console.log(
        "\x1b[32m%s\x1b[0m",
        `[Manak Setu AI Agent: MULTI-STEP LLM] Executing LangGraph agent loop with cloud model for query: "${query}"`,
      );
      try {
        return await this.executeGraphAgent(
          query,
          translatedText,
          intent,
          model,
          detectedLang,
        );
      } catch (err) {
        console.warn(
          "[BISSaarthiAgent] LangGraph execution failed, falling back to deterministic intent handler:",
          err,
        );
      }
    } else {
      console.log(
        "\x1b[33m%s\x1b[0m",
        `[Manak Setu AI Agent: DETERMINISTIC HANDLER] Executing single-tool fallback mode for query: "${query}"`,
      );
    }

    // Fallback path for deterministic mode
    let retrievedEvidence: Evidence[] = [];
    const workflowOffers: AgentExecutionResponse["workflowOffers"] = [];

    if (this.toolsHandler) {
      if (
        intent === QueryIntent.TENDER_ANALYSIS ||
        intent === QueryIntent.PROCUREMENT_STANDARD_RECOMMENDATION
      ) {
        const res = await this.toolsHandler.executeTool(
          "recommend_procurement_standards",
          {
            query: translatedText,
            entities: preservedEntities,
          },
        );
        retrievedEvidence = res.evidence;
        workflowOffers.push(
          {
            type: "RUN_GFR_AUDIT",
            label: "Audit GFR 144(i) Bias",
            actionPayload: { query: translatedText },
          },
          {
            type: "VIEW_PDI_SCHEDULE",
            label: "View PDI Inspection Schedule",
            actionPayload: { query: translatedText },
          },
          {
            type: "GENERATE_REPORT",
            label: "Generate GeM Procurement Dossier",
            actionPayload: { query: translatedText },
          },
        );
      } else if (intent === QueryIntent.GFR_COMPLIANCE_AUDIT) {
        const res = await this.toolsHandler.executeTool(
          "audit_gfr_144i_compliance",
          {
            query: translatedText,
          },
        );
        retrievedEvidence = res.evidence;
        workflowOffers.push({
          type: "ANALYZE_TENDER",
          label: "Analyze Full Tender BOQ",
          actionPayload: { query: translatedText },
        });
      } else if (intent === QueryIntent.SUPERSEDED_STANDARD_CHECK) {
        const res = await this.toolsHandler.executeTool(
          "check_superseded_standard",
          {
            query: translatedText,
          },
        );
        retrievedEvidence = res.evidence;
        workflowOffers.push({
          type: "VIEW_PDI_SCHEDULE",
          label: "View Active PDI Schedule",
          actionPayload: { query: translatedText },
        });
      } else if (
        intent === QueryIntent.PDI_INSPECTION_SCHEDULE ||
        intent === QueryIntent.TESTING_REQUIREMENTS
      ) {
        const res = await this.toolsHandler.executeTool(
          "get_pdi_inspection_schedule",
          {
            query: translatedText,
          },
        );
        retrievedEvidence = res.evidence;
        workflowOffers.push({
          type: "FIND_LAB",
          label: "Find Accredited NABL Labs",
          actionPayload: { query: translatedText },
        });
      } else if (intent === QueryIntent.LABORATORY_LOOKUP) {
        const res = await this.toolsHandler.executeTool("search_laboratories", {
          query: translatedText,
        });
        retrievedEvidence = res.evidence;
      } else {
        const res = await this.toolsHandler.executeTool(
          "search_bis_documents",
          {
            query: translatedText,
          },
        );
        retrievedEvidence = res.evidence;
      }
    }

    const llmResult = await this.llmProvider.generateText(
      translatedText,
      retrievedEvidence,
    );
    let finalAnswer = llmResult.text;

    if (detectedLang !== IndianLanguage.EN) {
      finalAnswer = await this.languageEngine.translateFromEnglish(
        finalAnswer,
        detectedLang,
        preservedEntities,
      );
    }

    const citations = this.citationBuilder.buildCitations(retrievedEvidence);
    const suggestedFollowUps = this.generateSuggestedFollowups(
      intent,
      detectedLang,
    );

    return {
      query,
      intent,
      structuredAnswer: finalAnswer,
      citations,
      evidence: retrievedEvidence,
      suggestedFollowUps,
      workflowOffers,
    };
  }

  private async executeGraphAgent(
    originalQuery: string,
    translatedText: string,
    intent: QueryIntent,
    model: BaseChatModel,
    detectedLang: IndianLanguage,
  ): Promise<AgentExecutionResponse> {
    const handler = this.toolsHandler!;
    const collectedEvidence: Evidence[] = [];

    const evidenceCollector = (ev: Evidence[]) => {
      ev.forEach((e) => {
        if (!collectedEvidence.some((ex) => ex.id === e.id)) {
          collectedEvidence.push(e);
        }
      });
    };

    // Procurement tools definitions
    const tools = [
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "recommend_procurement_standards",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "recommend_procurement_standards",
          description:
            "Recommend primary Indian Standards (IS), QCO Gazette mandates, and normative reference standards for tender specifications / BOQ items.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "audit_gfr_144i_compliance",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "audit_gfr_144i_compliance",
          description:
            "Audit tender specification text for brand bias, restrictive criteria, or proprietary makes violating GFR 2017 Rule 144(i), and generate neutral replacement clauses.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "check_superseded_standard",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "check_superseded_standard",
          description:
            "Check if an Indian Standard cited in a tender is obsolete/withdrawn and get the active replacement standard with revision summary.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "get_pdi_inspection_schedule",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "get_pdi_inspection_schedule",
          description:
            "Get Pre-Dispatch Inspection (PDI) lot inspection criteria, acceptance tests, and sampling plans (IS 2500) for procurement quality assurance.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_standards", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_standards",
          description:
            "Search Indian Standards repository by standard number, title, division, or keyword.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_laboratories", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_laboratories",
          description:
            "Find NABL accredited and BIS recognized laboratories authorized for standard testing.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_bis_documents", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_bis_documents",
          description:
            "Search authoritative BIS document chunks for clause text, tables, and statutory QCO requirements.",
          schema: z.object({ query: z.string() }),
        },
      ),
    ];

    const modelWithTools = (model as any).bindTools(tools);

    const workflow = new StateGraph(AgentStateAnnotation)
      .addNode("agent", async (state) => {
        const response = await modelWithTools.invoke(state.messages);
        return { messages: [response] };
      })
      .addNode("tools", async (state) => {
        const lastMsg = state.messages[state.messages.length - 1] as any;
        const toolCalls = lastMsg.tool_calls || [];
        const toolMessages: ToolMessage[] = [];

        for (const tc of toolCalls) {
          const targetTool = tools.find((t) => t.name === tc.name);
          if (targetTool) {
            const toolResult = await targetTool.invoke(tc.args);
            toolMessages.push(
              new ToolMessage({
                content:
                  typeof toolResult === "string"
                    ? toolResult
                    : JSON.stringify(toolResult),
                tool_call_id: tc.id,
              }),
            );
          }
        }

        return { messages: toolMessages };
      })
      .addEdge("tools", "agent")
      .addConditionalEdges("agent", (state) => {
        const lastMsg = state.messages[state.messages.length - 1] as any;
        if (lastMsg?.tool_calls && lastMsg.tool_calls.length > 0) {
          return "tools";
        }
        return END;
      })
      .addEdge("__start__", "agent");

    const app = workflow.compile();

    const initialState = {
      messages: [
        new SystemMessage(BIS_SYSTEM_PROMPT),
        new HumanMessage(translatedText),
      ],
    };

    const finalState = await app.invoke(initialState);
    const finalMsg = finalState.messages[finalState.messages.length - 1];
    let answerText =
      typeof finalMsg.content === "string"
        ? finalMsg.content
        : JSON.stringify(finalMsg.content);

    if (detectedLang !== IndianLanguage.EN) {
      answerText = await this.languageEngine.translateFromEnglish(
        answerText,
        detectedLang,
      );
    }

    const citations = this.citationBuilder.buildCitations(collectedEvidence);
    const suggestedFollowUps = this.generateSuggestedFollowups(
      intent,
      detectedLang,
    );
    const workflowOffers: AgentExecutionResponse["workflowOffers"] = [
      {
        type: "RUN_GFR_AUDIT",
        label: "Audit GFR 144(i) Bias",
        actionPayload: { query: translatedText },
      },
      {
        type: "VIEW_PDI_SCHEDULE",
        label: "View PDI Inspection Schedule",
        actionPayload: { query: translatedText },
      },
      {
        type: "GENERATE_REPORT",
        label: "Generate GeM Procurement Dossier",
        actionPayload: { query: translatedText },
      },
    ];

    return {
      query: originalQuery,
      intent,
      structuredAnswer: answerText,
      citations,
      evidence: collectedEvidence,
      suggestedFollowUps,
      workflowOffers,
    };
  }

  private generateSuggestedFollowups(
    intent: QueryIntent,
    lang: IndianLanguage = IndianLanguage.EN,
  ): string[] {
    if (lang === IndianLanguage.HI) {
      if (
        intent === QueryIntent.TENDER_ANALYSIS ||
        intent === QueryIntent.PROCUREMENT_STANDARD_RECOMMENDATION
      ) {
        return [
          "इस निविदा विनिर्देश के लिए जीएफआर 144(i) पूर्वाग्रह ऑडिट चलाएं",
          "लागू पूर्व-प्रेषण निरीक्षण (PDI) परीक्षण अनुसूची दिखाएं",
          "GeM के लिए एक पूर्ण खरीद अनुपालन डोजियर निर्यात करें",
        ];
      }
      if (intent === QueryIntent.GFR_COMPLIANCE_AUDIT) {
        return [
          "प्रतिबंधित ब्रांडों के लिए मानक-अनुरूप तटस्थ खंड उत्पन्न करें",
          "क्या इस निविदा में कोई अप्रचलित भारतीय मानक शामिल है?",
          "मानक के तहत वैधानिक QCO आवश्यकताएं क्या हैं?",
        ];
      }
      if (intent === QueryIntent.SUPERSEDED_STANDARD_CHECK) {
        return [
          "सक्रिय मानक में मुख्य तकनीकी संशोधन क्या हैं?",
          "नए मानक के तहत अनिवार्य परीक्षण आवश्यकताएं क्या हैं?",
          "GeM निविदा के लिए अद्यतन विनिर्देश खंड दिखाएं",
        ];
      }
      return [
        "लागू भारतीय मानक और QCO आदेश खोजें",
        "GeM निविदा विनिर्देशों का विश्लेषण करें",
        "निकटतम मान्यता प्राप्त NABL/BIS परीक्षण लैब खोजें",
      ];
    }

    if (
      intent === QueryIntent.TENDER_ANALYSIS ||
      intent === QueryIntent.PROCUREMENT_STANDARD_RECOMMENDATION
    ) {
      return [
        "Audit this specification for GFR Rule 144(i) restrictive brand bias",
        "Show Pre-Dispatch Inspection (PDI) lot sampling and test criteria",
        "Generate a complete GeM Procurement Compliance Dossier",
      ];
    }
    if (intent === QueryIntent.GFR_COMPLIANCE_AUDIT) {
      return [
        "Generate neutral, standard-compliant clauses for restrictive makes",
        "Are there any superseded or withdrawn standards cited in this tender?",
        "What are the mandatory QCO Gazette notifications for these items?",
      ];
    }
    if (intent === QueryIntent.SUPERSEDED_STANDARD_CHECK) {
      return [
        "What are the key technical upgrades in the active replacement standard?",
        "What are the mandatory PDI acceptance tests under the new standard?",
        "Generate copy-pasteable GeM clause with active standard citation",
      ];
    }
    return [
      "Recommend applicable Indian Standards for procurement tender",
      "Audit tender specifications for GFR 144(i) compliance",
      "Find NABL accredited laboratories for pre-dispatch inspection testing",
    ];
  }
}
