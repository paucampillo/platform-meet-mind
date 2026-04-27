export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const getDefaultError = (status?: number) => {
  if (status === 404) {
    return "Endpoint API introuvable. Lance le projet avec `vercel dev` ou `netlify dev` pour utiliser /api/* en local.";
  }
  if (status === 401 || status === 403) {
    return "Accès refusé par le provider IA. Vérifie les variables d'environnement côté serveur.";
  }
  if (status === 429) {
    return "Limite de requêtes atteinte. Réessaie dans quelques instants.";
  }
  return "Erreur serveur pendant l'appel API.";
};

const getRequestCandidates = (url: string): string[] => {
  const candidates = [url];

  if (typeof window === "undefined" || !url.startsWith("/")) {
    return candidates;
  }

  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isLocalHost) {
    return candidates;
  }

  candidates.push(`http://localhost:3000${url}`);
  candidates.push(`http://127.0.0.1:3000${url}`);
  return Array.from(new Set(candidates));
};

export async function postApiJson<T = any>(url: string, payload: unknown): Promise<T> {
  const candidates = getRequestCandidates(url);
  let response: Response | null = null;
  let lastNetworkError: unknown = null;

  for (const candidate of candidates) {
    try {
      response = await fetch(candidate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      break;
    } catch (error) {
      lastNetworkError = error;
    }
  }

  if (!response) {
    const attempted = candidates.join(", ");
    const reason =
      lastNetworkError instanceof Error && lastNetworkError.message
        ? ` (${lastNetworkError.message})`
        : "";
    throw new ApiClientError(
      `Impossible de joindre l'API. Vérifie que le serveur tourne (utilise \`vercel dev\` ou \`netlify dev\` en local). Tentatives: ${attempted}${reason}`,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new ApiClientError(text || getDefaultError(response.status), response.status);
    }
  }

  if (!response.ok) {
    const message = data?.error || data?.message || getDefaultError(response.status);
    throw new ApiClientError(message, response.status);
  }

  if (data?.success === false) {
    throw new ApiClientError(data?.error || "L'API a renvoyé une erreur.");
  }

  return data as T;
}
