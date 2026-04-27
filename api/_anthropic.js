const ANTHROPIC_KEY_CANDIDATES = [
  "ANTHROPIC_API_KEY",
  "CLAUDE_API_KEY",
  "ANTHROPIC_KEY",
  "VITE_ANTHROPIC_API_KEY",
];

const OPEN_ROUTER_KEY_CANDIDATES = ["OPEN_ROUTER_API_KEY", "VITE_OPEN_ROUTER_API_KEY"];

const OPEN_ROUTER_MODEL_CANDIDATES = [
  "openrouter/free",
  "deepseek/deepseek-r1:free",
  "qwen/qwen2.5-7b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

export const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const readEnvKey = (candidates) => {
  for (const keyName of candidates) {
    const value = process.env?.[keyName];
    if (value && String(value).trim().length > 0) {
      return String(value).trim();
    }
  }
  return null;
};

export const getAnthropicApiKey = () => readEnvKey(ANTHROPIC_KEY_CANDIDATES);

export const getOpenRouterApiKey = () => readEnvKey(OPEN_ROUTER_KEY_CANDIDATES);

const extractProviderMessage = (body) => {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body?.error?.message === "string") return body.error.message;
  if (typeof body?.message === "string") return body.message;
  return null;
};

const readOpenRouterText = (payload) => {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n")
      .trim();
  }
  return "";
};

const callViaAnthropic = async ({ apiKey, systemPrompt, userPrompt, maxTokens }) => {
  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (error) {
    return {
      ok: false,
      status: 502,
      error: `Network error calling Anthropic: ${error?.message || "unknown"}`,
    };
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const providerMessage = extractProviderMessage(payload);
    return {
      ok: false,
      status: response.status || 502,
      error:
        providerMessage ||
        `Anthropic returned an error (${response.status}). Check key and quota.`,
      provider: payload,
    };
  }

  const text = payload?.content?.[0]?.text;
  if (!text || typeof text !== "string") {
    return {
      ok: false,
      status: 502,
      error: "Invalid Anthropic response (empty content).",
      provider: payload,
    };
  }

  return {
    ok: true,
    text,
    provider: payload,
  };
};

const callViaOpenRouter = async ({ apiKey, systemPrompt, userPrompt, maxTokens }) => {
  let lastError = "OpenRouter request failed.";
  let lastStatus = 502;
  let lastPayload = null;

  for (const modelId of OPEN_ROUTER_MODEL_CANDIDATES) {
    let response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          temperature: 0.2,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });
    } catch (error) {
      return {
        ok: false,
        status: 502,
        error: `Network error calling OpenRouter: ${error?.message || "unknown"}`,
      };
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.ok) {
      const text = readOpenRouterText(payload);
      if (text) {
        return {
          ok: true,
          text,
          provider: payload,
        };
      }

      lastStatus = 502;
      lastPayload = payload;
      lastError = `OpenRouter model ${modelId} returned empty content.`;
      continue;
    }

    const providerMessage = extractProviderMessage(payload) || "";
    const recoverable =
      response.status === 429 ||
      /not a valid model id|no endpoints found|rate limit|provider returned error/i.test(
        providerMessage,
      );

    lastStatus = response.status || 502;
    lastPayload = payload;
    lastError = providerMessage || `OpenRouter returned an error (${lastStatus}).`;

    if (recoverable) {
      continue;
    }
    break;
  }

  return {
    ok: false,
    status: lastStatus,
    error: lastError,
    provider: lastPayload,
  };
};

export async function callAnthropic({ systemPrompt, userPrompt, maxTokens = 2000 }) {
  const anthropicKey = getAnthropicApiKey();
  if (anthropicKey) {
    return callViaAnthropic({ apiKey: anthropicKey, systemPrompt, userPrompt, maxTokens });
  }

  const openRouterKey = getOpenRouterApiKey();
  if (openRouterKey) {
    return callViaOpenRouter({ apiKey: openRouterKey, systemPrompt, userPrompt, maxTokens });
  }

  return {
    ok: false,
    status: 500,
    error:
      "Missing provider API key. Configure ANTHROPIC_API_KEY or OPEN_ROUTER_API_KEY in server environment variables.",
  };
}

export const safeParseJsonText = (rawText) => {
  try {
    return {
      ok: true,
      data: JSON.parse(String(rawText).replace(/```json|```/g, "").trim()),
    };
  } catch {
    return {
      ok: false,
      data: null,
    };
  }
};
