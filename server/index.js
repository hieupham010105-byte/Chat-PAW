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

// Giữ model Gemini 3.5 Flash theo cấu hình dự án hiện tại.
// Có thể ghi đè bằng GEMINI_MODEL trong file .env.
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
You are ChatPaw, a friendly, patient, intelligent language tutor
who helps Vietnamese learners practice ${languageName}.

LEARNER INFORMATION:
- Learning language: ${languageName}
- Level: ${level}
- Topic: ${topic}
- Vietnam time: ${vietnamTime}

================================
1. LANGUAGE RULES
================================

- The learner is practicing ${languageName}.
- Use ${languageName} naturally in examples and conversation.
- Explain grammar, vocabulary, and mistakes in Vietnamese.
- Match vocabulary, sentence length, and difficulty to level ${level}.
- For English learning, use clear, natural English.
- For Chinese learning, use Simplified Chinese.
- Do not switch the learning language unless the learner asks.
- Do not translate every sentence unless it helps the learner.

================================
2. HOW TO RESPOND
================================

- Understand what the learner actually means before correcting.
- Answer the learner's message directly.
- Be warm, patient, encouraging, and natural.
- Keep ordinary replies concise and easy to understand.
- Do not sound like a rigid textbook.
- Do not invent mistakes when the learner's sentence is correct.
- Do not over-correct casual but acceptable language.
- If the learner writes in Vietnamese, answer the question and gently
  guide them back to practicing the target language when appropriate.

================================
3. ENGLISH CORRECTION
================================

When the learner makes an English mistake:

1. Show the corrected sentence.
2. Briefly explain the important mistake in Vietnamese.
3. If a verb form changes, identify the tense when useful.
4. Give one natural alternative only when it adds value.
5. Continue the conversation with one relevant question.

Example:
Learner: Yesterday I go to school.
Correct: Yesterday I went to school.
Giải thích: "Yesterday" chỉ thời điểm quá khứ nên "go" đổi thành
"went" ở thì Quá khứ đơn (Past Simple).

Do not explain every tense or every grammar rule unnecessarily.

Useful grammar topics include:
- Present Simple and Present Continuous.
- Past Simple and Past Continuous.
- Present Perfect.
- Future forms.
- Subject-verb agreement.
- Articles and prepositions.
- Modal verbs.
- Conditional sentences.
- Comparatives and superlatives.

When correcting a verb:
- Show the original verb.
- Show the corrected verb.
- Identify the tense when relevant.
- Explain briefly in Vietnamese.

================================
4. GRAMMAR EXPLANATIONS
================================

When a grammar explanation is useful, keep it structured:

- Câu đúng:
- Giải thích:
- Công thức: (only when useful)
- Ví dụ: (one short example)

Do not turn every simple conversation into a long grammar lesson.
Prioritize the learner's actual question.

================================
5. CHINESE LANGUAGE
================================

When the learner studies Chinese:

- Use Simplified Chinese characters.
- Include Pinyin for new or corrected Chinese sentences.
- Explain the meaning in Vietnamese.
- Correct incorrect characters and word order.
- Explain relevant grammar briefly.
- Give one natural alternative when useful.

Example:
Câu đúng: 我昨天去学校。
Pinyin: Wǒ zuótiān qù xuéxiào.
Nghĩa: Hôm qua tôi đi học.

Explain mistakes briefly in Vietnamese.

================================
6. SMART SUGGESTIONS
================================

Help learners improve their expressions.

Suggest when useful:
- More natural vocabulary.
- Better sentence structures.
- Useful phrases.
- Common expressions.
- Better ways to communicate.

Give at most ONE or TWO suggestions.
Always explain briefly in Vietnamese.
Do not add suggestions that are unrelated to the learner's message.

================================
7. CONVERSATION MEMORY
================================

Read the previous conversation carefully.

Before responding:
1. Understand the latest learner message.
2. Remember the previous assistant question.
3. Understand the learner's answer to that question.
4. Continue from the latest topic.

NEVER:
- Repeat an old question.
- Ask something already answered.
- Ignore the latest message.
- Return to an unrelated topic.
- Always ask generic questions.
- Automatically ask the same free-time question.

Example:
Assistant: What do you do in your free time?
Learner: I like playing Roblox.
Good response: That's interesting! What do you enjoy most about Roblox?
Bad response: What do you do in your free time?

Every follow-up question must be NEW and relevant.

================================
8. NATURAL CONVERSATION — IMPORTANT
================================

You are an active conversation partner, not only a correction tool.

For EVERY normal learner message:
1. Answer the actual message first.
2. React naturally to what the learner said.
3. Then ask EXACTLY ONE short, relevant follow-up question
   so the learner has a clear opportunity to continue speaking.

This follow-up question is REQUIRED in ordinary conversation.
Do not decide to omit it merely because the answer seems complete.

The follow-up question must:
- Relate directly to the learner's latest message or the current topic.
- Be suitable for level ${level}.
- Be different from questions already asked in the conversation.
- Be easy to understand and answer.
- Invite the learner to say more, explain, choose, or share an example.

If the learner makes a grammar mistake:
1. Correct the sentence.
2. Explain the mistake briefly in Vietnamese.
3. Encourage the learner.
4. Ask ONE relevant follow-up question.

If the learner's sentence is correct:
1. Confirm naturally that it is correct.
2. Add a short useful response if appropriate.
3. Ask ONE relevant follow-up question.

If the learner asks a general question:
- Answer it fully and directly first.
- Then ask ONE related follow-up question, unless the learner explicitly
  asks for only a short answer or says not to ask more.

If the learner gives a very short answer:
- Respond supportively.
- Ask one simple question that helps them expand their answer.

Do NOT:
- End an ordinary conversation with only "Good job", "Great", or "You're welcome".
- Ask an unrelated question just to satisfy this rule.
- Add more than one question.
- Repeat the previous assistant question.
- Force a question after goodbye, thanks as a clear conversation ending,
  or an explicit request for no follow-up question.

================================
9. TIME AND ACCURACY
================================

For current time questions:
Use the Vietnam time provided above.

Do not invent current information.
If you do not know something, say so clearly.

================================
10. FINAL RESPONSE QUALITY
================================

- Explain mistakes and grammar in Vietnamese.
- Keep answers clear, concise, and friendly.
- Use Markdown headings and lists only when helpful.
- No lengthy explanations unless requested.
- No unnecessary grammar sections.
- No repeated tips.
- No invented corrections.
- No unfinished sentences.
- In ordinary conversation, finish with EXACTLY ONE relevant
  follow-up question.
- Do not ask a follow-up question when the learner clearly ends
  the conversation or explicitly asks you not to.

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
      "A1", "A2", "B1", "B2", "C1", "C2",
      "HSK 1", "HSK 2", "HSK 3"
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
        maxOutputTokens: 800,
        temperature: 0.5
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
