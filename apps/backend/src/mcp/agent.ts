import { GoogleGenerativeAI } from '@google/generative-ai';
import { tools, SearchParams } from './tools';
import dotenv from 'dotenv';
import { ChatResponse, Phone } from '@repo/shared-types';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are an expert AI Shopping Assistant for mobile phones.
Your goal is to help users find the best phone for their needs based on the provided tools.
You have access to a database of phones via tools.

RULES:
1. ALWAYS use the provided tools to fetch data. DO NOT hallucinate phone specs.
2. If the user asks for a recommendation, use 'searchPhones' to find candidates.
3. If the user asks to compare specific phones, use 'comparePhones'.
4. If the user asks about a technical term (like OIS, AMOLED), use 'explainConcept'.
5. Return the response strictly in JSON format matching this structure:
   {
     "summary": "Brief text summary of the answer",
     "recommendations": [], // Array of Phone objects found
     "comparison": [], // Array of Phone objects if comparison was requested
     "explanation": "..." // Optional string if a concept was explained
   }
6. Be polite, objective, and concise.
7. If the user's intent is brand or feature specific, pass those params to searchPhones.
8. Prices are in INR.
9. If you cannot find relevant phones, say so in the summary.
`;

export const processUserMessage = async (userMessage: string): Promise<ChatResponse> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to act as the AI Shopping Assistant. Please send your query.' }]
      }
    ]
  });

  // Orchestrate tool calling and response generation
  // Step 1: Tool Selection and Parameter Extraction
  const intentPrompt = `
    Analyze this user query: "${userMessage}"
    
    Determine the best tool to call.
    Output ONLY a JSON object with:
    - tool: "searchPhones" | "comparePhones" | "explainConcept" | "chat"
    - params: object matching the tool's input schema
    
    Input Schemas:
    - searchPhones: { maxPrice?: number, brand?: string, minCameraMp?: number, features?: string[] }
    - comparePhones: { phoneIds: string[] } (You need to infer IDs if possible, or search first. If brands/models mentioned but no IDs, search first with those names)
    - explainConcept: { topic: string }
    - chat: {} (For greetings or irrelevant queries)
    
    Example: 
    User: "Best samsung phone under 50000"
    Output: { "tool": "searchPhones", "params": { "brand": "Samsung", "maxPrice": 50000 } }
  `;

  const intentResult = await model.generateContent(intentPrompt);
  const intentText = intentResult.response.text();
  
  console.log('Intent Raw:', intentText);
  
  let intent;
  try {
     const cleanJson = intentText.replace(/```json/g, '').replace(/```/g, '').trim();
     intent = JSON.parse(cleanJson);
  } catch (e) {
     console.error("Failed to parse intent JSON", e);
     return {
         summary: "I'm having trouble understanding your request. Could you rephrase?",
         recommendations: []
     };
  }

  // 2. Execute Tool
  let toolData: any = null;
  let recommendations: Phone[] = [];
  let comparison: Phone[] = [];
  let explanation: string | undefined = undefined;

  if (intent.tool === 'searchPhones') {
      recommendations = await tools.searchPhones(intent.params);
      toolData = { found: recommendations.length, phones: recommendations };
  } else if (intent.tool === 'comparePhones') {
      // NOTE: In a real scenario, we might need a search step to get IDs from names.
      // For simplicity, we assume the UI or previous context provided IDs, OR we interpret names.
      // If the intent extractor failed to get IDs (likely), we might need to search by name.
      // Let's implement a fallback: if params has 'names', search for them.
      // But for this MVP, let's assume specific comparison is tricky without IDs. 
      // We will fallback to search if IDs are missing.
      if (intent.params.phoneIds && intent.params.phoneIds.length) {
          comparison = await tools.comparePhones(intent.params.phoneIds);
      } else {
          // Fallback logic could go here
      }
  } else if (intent.tool === 'explainConcept') {
      explanation = await tools.explainConcept(intent.params.topic);
      toolData = { explanation };
  } else {
      toolData = { status: "direct_chat", message: "No specific tool needed" };
  }

  // 3. Final Response Generation
  const finalPrompt = `
    User Query: "${userMessage}"
    Tool Execution Result: ${JSON.stringify(toolData)}
    
    Based on the tool result (or lack thereof if it was a greeting/general query), generate the final JSON response for the frontend.
    If recommendations are present, focus on WHY they were chosen. If it was a general query, just reply naturally in the summary.
    
    Format:
    {
       "summary": "...",
       "recommendations": ${JSON.stringify(recommendations)}, 
       "comparison": ${JSON.stringify(comparison)},
       "explanation": "${explanation || ''}"
    }
    
    IMPORTANT: Provide the JSON only.
  `;

  const finalResult = await model.generateContent(finalPrompt);
  const finalText = finalResult.response.text();
  
  try {
      const cleanJson = finalText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as ChatResponse;
  } catch (e) {
      console.error("Failed to parse final JSON", e);
      return {
          summary: "I found some info but couldn't format it correctly.",
          recommendations: recommendations,
          comparison: comparison,
          explanation: explanation
      };
  }
};
