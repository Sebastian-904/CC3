import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
    // In a real app, you might want to handle this more gracefully,
    // but for this context, throwing an error is clear.
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const defaultSystemInstruction = `You are a helpful assistant for a compliance management application.
When asked to create a task from natural language, you MUST respond with a JSON object in the following format:
{"isTaskSuggestion": true, "task": {"title": "Task Title", "dueDate": "YYYY-MM-DD", "description": "A brief description of the task."}}
If you cannot extract a task, or if the user is just chatting, provide a helpful, conversational response as plain text.
Today's date is ${new Date().toISOString().split('T')[0]}.`;

export const getAIAssistantResponse = async (prompt: string, customSystemInstruction?: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Sorry, the AI Assistant is not configured. Missing API Key.";
    }
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: customSystemInstruction || defaultSystemInstruction,
            },
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Sorry, I encountered an error: ${error.message}`;
        }
        return "Sorry, I encountered an unknown error while processing your request.";
    }
};
