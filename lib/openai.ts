import OpenAI from 'openai';

if (!process.env.AZURE_OPENAI_API_KEY) {
  throw new Error('Missing AZURE_OPENAI_API_KEY environment variable');
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error('Missing AZURE_OPENAI_ENDPOINT environment variable');
}

if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
  throw new Error('Missing AZURE_OPENAI_DEPLOYMENT_NAME environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

export interface RequirementPrompt {
  context: string;
  persona: string;
  product: string;
  count?: number;
}

export interface GeneratedQuestion {
  question: string;
}

export async function generateRequirements(prompt: RequirementPrompt): Promise<GeneratedQuestion[]> {
  const { context, persona, product, count = 3 } = prompt;

  const systemPrompt = `Your goal is to generate questions from a user on a given product.

You are given a context, a persona and a product.
The context describes where the user is accessing the product.
The persona describes the user themselves.
The product is the item the user is interested in.

# instructions
- empathize with the user based on the given persona
- imagine a situation grounded in the given context where the user would access the product
- generate ${count} question(s) this user would have on this product
- IMPORTANT: You must return ONLY ${count} lines of JSONL format, each line being exactly {"question":"[QUESTION]"}
- DO NOT include any other text, explanations, or formatting
- Each line must be valid JSON

Example output format:
{"question":"What are the key features of this product?"}
{"question":"How much does it cost?"}
{"question":"When can I start using it?"}`;

  const userPrompt = `- context: ${context}
- persona: ${persona}
- product: ${product}`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // JSONLをパースして質問の配列を返す
    const questions: GeneratedQuestion[] = [];
    const lines = content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (typeof parsed.question === 'string') {
          questions.push(parsed);
        }
      } catch (error) {
        console.error('Failed to parse line:', line, error);
        continue;
      }
    }

    if (questions.length === 0) {
      throw new Error('No valid questions were generated');
    }

    return questions;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate requirements: ' + (error as Error).message);
  }
}
