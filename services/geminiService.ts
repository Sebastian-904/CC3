import { GoogleGenAI, Type } from "@google/genai";
import { Company, AITaskSuggestion } from '../lib/types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistantResponse = async (text: string, customSystemInstruction?: string): Promise<string> => {
     try {
        const systemInstruction = customSystemInstruction || `You are a helpful AI assistant for a compliance management app. Your goal is to help users manage their tasks. When you identify a potential task or calendar event from the user's prompt, you MUST suggest it in a structured JSON format. The JSON object must have a key "isTaskSuggestion" set to true, and a "task" key containing the title, dueDate (in YYYY-MM-DD format), and a brief description. For all other queries, provide a helpful and concise text-based response.

Example of a task suggestion response:
{
  "isTaskSuggestion": true,
  "task": {
    "title": "File annual report",
    "dueDate": "2024-12-31",
    "description": "Complete and submit the company's annual financial report."
  }
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: text,
            config: {
                systemInstruction
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error with AI Assistant:", error);
        throw new Error("The AI assistant is currently unavailable.");
    }
};


export const extractCompanyDataFromText = async (text: string): Promise<Partial<Company>> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Extract the company information from the following text and return it as JSON. The text is: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        legalName: {
                            type: Type.STRING,
                            description: 'The full legal name of the company.',
                        },
                        rfc: {
                            type: Type.STRING,
                            description: 'The company\'s tax identification number (RFC).',
                        },
                        address: {
                            type: Type.STRING,
                            description: 'The company\'s full physical address.',
                        },
                        industry: {
                            type: Type.STRING,
                            description: 'The industry or sector the company operates in.',
                        },
                        registrationNumber: {
                            type: Type.STRING,
                            description: 'The company\'s official registration number.',
                        },
                        registeredAgent: {
                            type: Type.STRING,
                            description: 'The name of the company\'s registered agent.',
                        },
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsedData = JSON.parse(jsonStr);
        return parsedData as Partial<Company>;

    } catch (error) {
        console.error("Error extracting company data with Gemini:", error);
        throw new Error("Failed to process text with AI. Please check the format.");
    }
};

export const extractEventDataFromText = async (text: string): Promise<Partial<any>> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `From the text "${text}", extract the title of the event, the due date (in YYYY-MM-DD format), and a brief description.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: 'The title for the task or event.',
                        },
                        dueDate: {
                            type: Type.STRING,
                            description: 'The due date in YYYY-MM-DD format.',
                        },
                        description: {
                            type: Type.STRING,
                            description: 'A short description of the event.',
                        }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch(error) {
        console.error("Error extracting event data with Gemini:", error);
        throw new Error("Failed to create event from text with AI.");
    }
};