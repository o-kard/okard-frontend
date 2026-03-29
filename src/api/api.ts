export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;                 // object หรือ FormData
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;               // ms
  credentials?: RequestCredentials; // เช่น "include" ถ้าใช้ cookie
};

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    signal,
    timeout = 30_000,
    credentials,
  } = opts;

  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort("timeout"), timeout);

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const finalHeaders = {
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body == null ? undefined : isForm ? (body as any) : JSON.stringify(body),
      signal: mergeSignals(signal, ac.signal),
      credentials,
    });

    const ct = res.headers.get("content-type") || "";
    const txt = await res.text();
    const data = (txt && ct.includes("application/json") ? JSON.parse(txt) : undefined) as T;

    if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`, data);
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

function mergeSignals(a?: AbortSignal, b?: AbortSignal) {
  if (!a) return b;
  if (!b) return a;
  const c = new AbortController();
  const off = () => c.abort();
  a.addEventListener("abort", off);
  b.addEventListener("abort", off);
  if (a.aborted || b.aborted) c.abort();
  return c.signal;
}