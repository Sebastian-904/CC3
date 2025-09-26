import { GoogleGenAI, Type } from '@google/genai';
import { AIExtractedCompany, AITaskSuggestion } from '../lib/types';

// FIX: Per coding guidelines, initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const taskSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    isTaskSuggestion: { type: Type.BOOLEAN, description: 'Always true if the user is asking to create a task.' },
    task: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'The title of the task.' },
        description: { type: Type.STRING, description: 'A detailed description of the task.' },
        dueDate: { type: Type.STRING, description: 'The due date for the task in YYYY-MM-DD format.' },
      },
      required: ['title', 'description', 'dueDate'],
    },
  },
  required: ['isTaskSuggestion', 'task'],
};

export const getAIAssistantResponse = async (prompt: string): Promise<string | AITaskSuggestion> => {
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analyze the following user request. If it's a request to create a task, reminder, or calendar event, respond ONLY with a JSON object that follows the provided schema. Otherwise, provide a helpful, conversational response as a plain string. User request: "${prompt}"`,
          config: {
              responseMimeType: "application/json",
              responseSchema: taskSuggestionSchema,
          }
      });

      // FIX: Per coding guidelines, directly access the .text property for the response.
      const textResponse = response.text;
      
      // Attempt to parse as a task suggestion
      try {
          const parsed = JSON.parse(textResponse);
          if (parsed.isTaskSuggestion && parsed.task) {
              return parsed as AITaskSuggestion;
          }
      } catch (e) {
          // Not a JSON object, treat as a regular string response
      }

      // Fallback to text if it's not a valid task suggestion JSON
      const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              systemInstruction: "You are a helpful assistant for a compliance management software. Be concise and helpful."
          }
      });

      // FIX: Per coding guidelines, directly access the .text property for the response.
      return fallbackResponse.text;

  } catch (error) {
      console.error("Error getting AI assistant response:", error);
      // Try to parse the error to give a more specific message
      if (error instanceof Error && error.message.includes('API key not valid')) {
          throw new Error("Invalid API Key. Please check your configuration.");
      }
      throw new Error("The AI assistant is currently unavailable. Please try again later.");
  }
};


const companyExtractionSchema = {
  type: Type.OBJECT,
  properties: {
      name: {
          type: Type.OBJECT,
          properties: {
              value: { type: Type.STRING, description: "The full legal name of the company (Razón Social)." },
              confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
          },
          required: ['value', 'confidence'],
      },
      general: {
          type: Type.OBJECT,
          properties: {
              datosFiscales: {
                  type: Type.OBJECT,
                  properties: {
                      razonSocial: {
                          type: Type.OBJECT,
                          properties: {
                              value: { type: Type.STRING, description: "The full legal name of the company (Razón Social)." },
                              confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
                          },
                          required: ['value', 'confidence'],
                      },
                      rfc: {
                           type: Type.OBJECT,
                          properties: {
                              value: { type: Type.STRING, description: "The company's RFC (Registro Federal de Contribuyentes)." },
                              confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
                          },
                          required: ['value', 'confidence'],
                      }
                  },
                  required: ['razonSocial', 'rfc'],
              }
          },
          required: ['datosFiscales'],
      }
  },
  required: ['name', 'general'],
};

export const extractCompanyDataFromDocument = async (document: { base64: string, mimeType: string }): Promise<AIExtractedCompany> => {
    try {
        const imagePart = {
            inlineData: {
                data: document.base64,
                mimeType: document.mimeType,
            },
        };
        const textPart = {
            text: "Extract the company's legal name (razón social) and RFC from this document. Provide your answer ONLY in the specified JSON format, with a confidence score for each field."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
              responseMimeType: "application/json",
              responseSchema: companyExtractionSchema,
            }
        });

        // FIX: Per coding guidelines, directly access the .text property for the response.
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as AIExtractedCompany;
    } catch (error) {
        console.error("Error extracting company data:", error);
        throw new Error("Failed to extract data from the document. The document might be unreadable or in an unsupported format.");
    }
};


export const getComplianceNews = async (companyProfile: { sector?: string, programs: string[] }): Promise<{ summary: string, sources: { uri: string; title: string }[] }> => {
    const prompt = `Based on the latest news from reliable sources, what are the most recent and important compliance updates in Mexico related to foreign trade, customs, and fiscal regulations? The company operates in the "${companyProfile.sector || 'general manufacturing'}" sector and has the following programs: ${companyProfile.programs.join(', ')}. Summarize the key points and provide the source URLs.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        // FIX: Per coding guidelines, directly access the .text property for the response.
        const summary = response.text;
        // FIX: Per coding guidelines, access grounding chunks for sources.
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources = groundingChunks ? groundingChunks.map(chunk => chunk.web).filter(s => s?.uri && s?.title) as { uri: string, title: string }[] : [];

        return { summary, sources };
    } catch (error) {
        console.error("Error fetching compliance news:", error);
        throw new Error("Failed to fetch compliance news. Please check your connection or try again later.");
    }
};

export const summarizeLegalDocument = async (document: { base64: string, mimeType: string }): Promise<string> => {
  try {
      const docPart = {
          inlineData: {
              data: document.base64,
              mimeType: document.mimeType,
          },
      };
      const textPart = {
          text: "Summarize this legal document in 3-4 key bullet points, focusing on obligations, prohibitions, or recent changes relevant to a company. The summary should be concise and easy to understand for a non-lawyer."
      };

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [docPart, textPart] },
      });

      // FIX: Per coding guidelines, directly access the .text property for the response.
      return response.text;
  } catch (error) {
      console.error("Error summarizing document:", error);
      throw new Error("Failed to generate summary for the document.");
  }
};
