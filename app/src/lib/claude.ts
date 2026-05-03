// TODO: Replace with your actual Anthropic API key
// const ANTHROPIC_API_KEY = 'sk-ant-...';

/**
 * Calls the Anthropic API to get an AI-generated completion.
 * Currently stubbed — replace the body with a real API call using your key.
 */
export async function claudeComplete(prompt: string): Promise<string> {
  // TODO: Implement real Anthropic API call, e.g.:
  //
  // const response = await fetch('https://api.anthropic.com/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'x-api-key': ANTHROPIC_API_KEY,
  //     'anthropic-version': '2023-06-01',
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'claude-sonnet-4-6',
  //     max_tokens: 256,
  //     messages: [{ role: 'user', content: prompt }],
  //   }),
  // });
  // const data = await response.json();
  // return data.content[0].text;

  // Stub response for development
  await new Promise((r) => setTimeout(r, 800));
  return `[AI stub] Analysis for: "${prompt.slice(0, 60)}..." — configure your Anthropic API key in src/lib/claude.ts to enable real AI responses.`;
}
