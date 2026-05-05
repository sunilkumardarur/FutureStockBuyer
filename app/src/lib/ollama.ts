const OLLAMA_BASE = '/ollama';

export async function ollamaComplete(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3.2', prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.response as string;
}

/** Parse JSON out of a model response that may wrap it in markdown fences. */
export function extractJSON(raw: string): string {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const bracket = raw.match(/(\[[\s\S]*\])/);
  if (bracket) return bracket[1].trim();
  const curly = raw.match(/(\{[\s\S]*\})/);
  if (curly) return curly[1].trim();
  return raw.trim();
}
