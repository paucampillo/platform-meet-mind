const decodeBody = (event) => {
  if (!event?.body) return "";
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }
  return event.body;
};

const buildRequestLike = (event) => {
  const rawBody = decodeBody(event);

  return {
    method: event?.httpMethod || "GET",
    headers: event?.headers || {},
    async json() {
      if (!rawBody) return {};
      try {
        return JSON.parse(rawBody);
      } catch {
        throw new Error("Invalid JSON body");
      }
    },
    async text() {
      return rawBody || "";
    },
  };
};

const responseToNetlify = async (response) => {
  if (!response) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Empty handler response" }),
    };
  }

  if (response instanceof Response) {
    const headers = Object.fromEntries(response.headers.entries());
    const body = await response.text();
    return {
      statusCode: response.status || 200,
      headers,
      body,
    };
  }

  // Defensive fallback for non-Response returns.
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
};

export const runVercelStyleHandler = async (handler, event) => {
  try {
    const req = buildRequestLike(event);
    const response = await handler(req);
    return await responseToNetlify(response);
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: error?.message || "Unhandled function error",
      }),
    };
  }
};
