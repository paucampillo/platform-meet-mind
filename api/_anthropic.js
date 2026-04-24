const CANDIDATE_KEYS = [
  "ANTHROPIC_API_KEY",
  "CLAUDE_API_KEY",
  "ANTHROPIC_KEY",
  "VITE_ANTHROPIC_API_KEY",
];

export const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const getAnthropicApiKey = () => {
  for (const keyName of CANDIDATE_KEYS) {
    const value = process.env?.[keyName];
    if (value && String(value).trim().length > 0) {
      return String(value).trim();
    }
  }
  return null;
};

const extractProviderMessage = (body) => {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body?.error?.message === "string") return body.error.message;
  if (typeof body?.message === "string") return body.message;
  return null;
};

export async function callAnthropic({ systemPrompt, userPrompt, maxTokens = 2000 }) {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error:
        "ANTHROPIC_API_KEY manquante. Configure-la dans Vercel (ou lance avec `vercel dev` en local).",
    };
  }

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
      error: `Erreur réseau vers Anthropic: ${error?.message || "inconnue"}`,
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
        `Anthropic a renvoyé une erreur (${response.status}). Vérifie la clé API et les quotas.`,
      provider: payload,
    };
  }

  const text = payload?.content?.[0]?.text;
  if (!text || typeof text !== "string") {
    return {
      ok: false,
      status: 502,
      error: "Réponse Anthropic invalide (contenu vide).",
      provider: payload,
    };
  }

  return {
    ok: true,
    text,
    provider: payload,
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
