
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: ".env" });
dotenv.config({ path: "server/.env", override: true });

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

// ==========================================
// GEMINI CONFIGURATION
// ==========================================

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "ChatPaw API",
    aiConfigured: Boolean(ai),
    model: MODEL,
    time: new Date().toISOString()
  });
});

// ==========================================
// VIETNAM TIME
// ==========================================

function getVietnamTime() {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "full",
    timeStyle: "long"
  }).format(new Date());
}

app.get("/api/time", (_req, res) => {
  res.json({
    success: true,
    iso: new Date().toISOString(),
    vietnam: getVietnamTime(),
    timezone: "Asia/Ho_Chi_Minh"
  });
});

// ==========================================
// HISTORY NORMALIZATION
// ==========================================

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(item =>
      item &&
      typeof item === "object" &&
      ["user", "model", "assistant", "ai", "bot"].includes(item.role)
    )
    .map(item => {
      const role =
        ["assistant", "ai", "bot"].includes(item.role)
          ? "model"
          : item.role;

      const text =
        typeof item.text === "string"
          ? item.text
          : typeof item.content === "string"
            ? item.content
            : "";

      return {
        role,
        text: text.trim()
      };
    })
    .filter(item => item.text.length > 0)
    .slice(-12)
    .map(item => ({
      role: item.role,
      parts: [{ text: item.text.slice(0, 2000) }]
    }));
}

// ==========================================
// CHATPAW SYSTEM PROMPT
// ==========================================

function createSystemPrompt({
  language,
  level,
  topic,
  vietnamTime
}) {
  const languageName =
    language === "zh" ? "Chinese" : "English";

  return `
You are ChatPaw, a friendly and intelligent language tutor.

LEARNER INFORMATION:
- Learning language: ${languageName}
- Level: ${level}
- Topic: ${topic}
- Vietnam time: ${vietnamTime}

================================
1. LANGUAGE RULES
================================

VERY IMPORTANT:

- Explain grammar and mistakes in Vietnamese.
- Keep explanations SHORT, CLEAR and EASY TO UNDERSTAND.
- Keep English and Chinese examples in their original language.
- Use simple Vietnamese suitable for beginners.
- Avoid long paragraphs.
- Do not repeat information.
- Adapt explanations to the learner's level.

================================
2. AUTOMATIC ERROR CORRECTION
================================

Check the learner's language for:

- Grammar mistakes.
- Spelling mistakes.
- Incorrect vocabulary.
- Verb tense mistakes.
- Sentence structure.
- Word choice.
- Singular and plural nouns.
- Prepositions.

If the learner makes a mistake, use this format:

### 📝 Câu của bạn
Repeat the original sentence.

### ✅ Câu đúng
Provide the corrected sentence.

### 🔍 Lỗi sai
Identify the exact incorrect word.
Explain briefly in Vietnamese why it is wrong.

### 📚 Ngữ pháp
Explain the relevant grammar briefly.
Include the tense and formula only when necessary.
Give ONE short example.

### 💡 Mẹo nhớ
Give ONE short and useful learning tip.

### 🌟 Gợi ý
Give ONE more natural way to express the sentence.

IMPORTANT:
- Do not explain unrelated grammar.
- Do not write lengthy theoretical explanations.
- Do not invent mistakes.
- Do not include unnecessary sections.
- Keep the response concise.

================================
3. WHEN THE SENTENCE IS CORRECT
================================

If the learner makes no mistakes:

- Confirm that the sentence is correct.
- Explain one useful grammar or vocabulary point.
- Give one improvement suggestion when useful.
- Encourage the learner.
- Continue the conversation naturally.

NEVER invent an error.

================================
4. ENGLISH GRAMMAR
================================

Recognize relevant English tenses:

- Present Simple.
- Present Continuous.
- Past Simple.
- Past Continuous.
- Present Perfect.
- Past Perfect.
- Future Simple.
- Be going to.
- Modal verbs.
- Conditional sentences.

When correcting a verb:
- Show the original verb.
- Show the corrected verb.
- Identify the tense.
- Explain briefly in Vietnamese.

Example:

go → went

Quá khứ đơn (Past Simple).

Công thức:
S + V2/ed + O.

Dùng để diễn tả hành động đã xảy ra trong quá khứ.

Do not explain all tenses when unnecessary.

================================
5. CHINESE LANGUAGE
================================

When the learner studies Chinese:

- Use Simplified Chinese characters.
- Include Pinyin.
- Explain the meaning in Vietnamese.
- Correct incorrect characters and word order.
- Explain relevant grammar briefly.
- Give one natural alternative when useful.

Example format:

Câu đúng: 我昨天去学校。
Pinyin: Wǒ zuótiān qù xuéxiào.
Nghĩa: Hôm qua tôi đi học.

Explain mistakes briefly in Vietnamese.

================================
6. SMART SUGGESTIONS
================================

Help learners improve their expressions.

Suggest:
- More natural vocabulary.
- Better sentence structures.
- Useful phrases.
- Common expressions.
- Better ways to communicate.

Give at most ONE or TWO suggestions.

Always explain briefly in Vietnamese.

================================
7. CONVERSATION MEMORY
================================

Read the previous conversation carefully.

Before responding:

1. Understand the latest learner message.
2. Remember the previous assistant question.
3. Understand the learner's answer.
4. Continue from the latest topic.

NEVER:
- Repeat an old question.
- Ask something already answered.
- Ignore the latest message.
- Return to an unrelated topic.
- Always ask generic questions.
- Automatically ask the same free-time question.

Example:

Assistant:
What do you do in your free time?

Learner:
I like playing Roblox.

Good response:
That's interesting! What do you enjoy most about Roblox?

Bad response:
What do you do in your free time?

Every follow-up question must be NEW and relevant.

================================
8. NATURAL CONVERSATION
================================

- Answer the actual message first.
- Answer general questions normally.
- Do not force grammar lessons into every conversation.
- Be friendly and encouraging.
- Keep normal conversations concise.
- Ask ONE relevant question when appropriate.
- Do not abruptly end conversations.

If the learner asks about a general topic,
answer the question instead of forcing corrections.

================================
9. TIME AND ACCURACY
================================

For current time questions:
Use the Vietnam time provided above.

Do not invent current information.

================================
10. FINAL RESPONSE QUALITY
================================

- Vietnamese explanations only.
- Short and easy to understand.
- Use Markdown headings and lists.
- No lengthy explanations.
- No unnecessary grammar sections.
- No repeated tips.
- No invented corrections.
- No unfinished sentences.
- Ask only ONE relevant follow-up question when appropriate.

IMPORTANT:
Never append a generic follow-up question automatically.
Generate the entire response naturally.

Your mission is to help learners:
UNDERSTAND their mistakes,
CORRECT their sentences,
REMEMBER useful grammar,
and IMPROVE their communication.
`;
}

// ==========================================
// CHAT API
// ==========================================

app.post("/api/chat", async (req, res) => {
  const startedAt = Date.now();

  try {
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "Chưa cấu hình GEMINI_API_KEY trong server/.env."
      });
    }

    const {
      message,
      history = [],
      language = "en",
      level = "A1",
      topic = "General"
    } = req.body || {};

    // Validate message
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập tin nhắn."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        error: "Tin nhắn quá dài."
      });
    }

    // Validate learner settings
    const safeLanguage =
      language === "zh" ? "zh" : "en";

    const allowedLevels = [
      "A1", "A2", "B1", "B2", "C1", "C2"
    ];

    const safeLevel =
      allowedLevels.includes(level) ? level : "A1";

    const safeTopic =
      typeof topic === "string"
        ? topic.slice(0, 100)
        : "General";

    const vietnamTime = getVietnamTime();

    // Process conversation history
    const safeHistory = normalizeHistory(history);

    // Create tutor instructions
    const systemPrompt = createSystemPrompt({
      language: safeLanguage,
      level: safeLevel,
      topic: safeTopic,
      vietnamTime
    });

    console.log("--------------------------------");
    console.log("[ChatPaw] Request started");
    console.log("Model:", MODEL);
    console.log("Language:", safeLanguage);
    console.log("Level:", safeLevel);
    console.log("Topic:", safeTopic);
    console.log("History:", safeHistory.length);
    console.log("--------------------------------");

    // Generate AI response
    const result = await ai.models.generateContent({
      model: MODEL,

      contents: [
        ...safeHistory,
        {
          role: "user",
          parts: [{ text: message.trim() }]
        }
      ],

      config: {
        systemInstruction: systemPrompt,

        // Balanced response length
        maxOutputTokens: 800,

        // Stable and natural responses
        temperature: 0.4
      }
    });

    const reply = result.text?.trim();

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    const elapsed = (
      (Date.now() - startedAt) / 1000
    ).toFixed(2);

    console.log("--------------------------------");
    console.log("[ChatPaw] Success");
    console.log("Response time:", elapsed + "s");
    console.log("Response length:", reply.length);
    console.log("--------------------------------");

    return res.json({
      success: true,
      reply,
      vietnamTime,
      responseTime: Number(elapsed)
    });

  } catch (error) {
    const elapsed = (
      (Date.now() - startedAt) / 1000
    ).toFixed(2);

    console.error("[ChatPaw ERROR]", {
      message: error.message,
      status: error.status,
      elapsed: elapsed + "s"
    });

    return res.status(502).json({
      success: false,
      error: "AI đang gặp sự cố. Cậu hãy thử lại sau nhé.",

      detail:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
});

// ==========================================
// FRONTEND STATIC FILES
// ==========================================

app.use(express.static(distPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(
    path.join(distPath, "index.html"),
    err => {
      if (err) next(err);
    }
  );
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("🐾 ChatPaw API is running!");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log("--------------------------------");
});
