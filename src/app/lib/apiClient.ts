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
    return "Endpoint API introuvable. Lance le projet avec `vercel dev` pour utiliser /api/* en local.";
  }
  if (status === 401 || status === 403) {
    return "Accès refusé par Anthropic. Vérifie ANTHROPIC_API_KEY et les permissions de la clé.";
  }
  if (status === 429) {
    return "Limite de requêtes atteinte. Réessaie dans quelques instants.";
  }
  return "Erreur serveur pendant l'appel API.";
};

export async function postApiJson<T = any>(url: string, payload: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiClientError(
      "Impossible de joindre l'API. Vérifie que le serveur tourne (utilise `vercel dev` en local).",
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
