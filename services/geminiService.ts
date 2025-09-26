
import { GoogleGenAI, Type } from "@google/genai";
import { AIExtractedCompany, Company } from "../lib/types";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
    // In a real app, you might want to handle this more gracefully,
    // but for this context, throwing an error is clear.
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

export const getComplianceNews = async (companyProfile: { sector?: string, programs?: string[] }): Promise<{ summary: string; sources: { uri: string; title: string }[] }> => {
    if (!process.env.API_KEY) {
        throw new Error("AI Assistant is not configured. Missing API Key.");
    }

    // Construct a dynamic prompt
    let prompt = "What are the latest tax and customs compliance news and regulation updates in Mexico?";
    const relevantInfo = [];
    if (companyProfile.sector) {
        relevantInfo.push(`a company in the ${companyProfile.sector} sector`);
    }
    if (companyProfile.programs && companyProfile.programs.length > 0) {
        relevantInfo.push(`with ${companyProfile.programs.join(' and ')} programs`);
    }
    if (relevantInfo.length > 0) {
        prompt += ` This is relevant for ${relevantInfo.join(' ')}.`;
    }
    prompt += " Summarize the key points and potential impacts in a list format.";

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text.trim();
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        // FIX: The API may return `unknown`, so we ensure it's an array before reducing.
        const sources = Array.isArray(rawChunks) ? (rawChunks as any[]).reduce(
            (acc: { uri: string; title: string }[], chunk: any) => {
                const web = chunk?.web;
                if (web && web.uri && web.title) {
                    acc.push({ uri: web.uri, title: web.title });
                }
                return acc;
            },
            [] as { uri: string; title: string }[]
        ) : [];
        
        // Deduplicate sources
        const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

        return { summary, sources: uniqueSources };

    } catch (error) {
        console.error("Error calling Gemini API for news grounding:", error);
        if (error instanceof Error) {
            throw new Error(`AI news search failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI news search.");
    }
};

const withAIExtraSchema = (type: Type, description: string) => ({
    type: Type.OBJECT,
    properties: {
        value: { type, description },
        confidence: { type: Type.NUMBER, description: "Your confidence in the accuracy of this value, from 0.0 to 1.0." },
        source: { type: Type.STRING, description: "The exact text snippet from the document where you found this value." }
    },
    required: ["value", "confidence", "source"],
});


const companyDataSchema = {
    type: Type.OBJECT,
    properties: {
        name: withAIExtraSchema(Type.STRING, "The full legal name of the company."),
        general: {
            type: Type.OBJECT,
            properties: {
                datosFiscales: {
                    type: Type.OBJECT,
                    properties: {
                        razonSocial: withAIExtraSchema(Type.STRING, "Fiscal name (Razón Social)."),
                        rfc: withAIExtraSchema(Type.STRING, "Tax ID (RFC)."),
                        telefono: withAIExtraSchema(Type.STRING, "Primary phone number."),
                        domicilioFiscal: withAIExtraSchema(Type.STRING, "Fiscal address.")
                    }
                },
                actaConstitutiva: {
                    type: Type.OBJECT,
                    properties: {
                        numeroEscritura: withAIExtraSchema(Type.STRING, "Public instrument number for incorporation."),
                        fecha: withAIExtraSchema(Type.STRING, "Date of incorporation (YYYY-MM-DD)."),
                        nombreFedatario: withAIExtraSchema(Type.STRING, "Name of the notary public for incorporation.")
                    }
                },
                representanteLegal: {
                    type: Type.OBJECT,
                    properties: {
                        numeroEscrituraPoder: withAIExtraSchema(Type.STRING, "Public instrument number for power of attorney."),
                        fechaPoder: withAIExtraSchema(Type.STRING, "Date of power of attorney (YYYY-MM-DD)."),
                        nombreFedatario: withAIExtraSchema(Type.STRING, "Name of the notary public for power of attorney.")
                    }
                }
            }
        },
        programas: {
            type: Type.OBJECT,
            properties: {
                immex: {
                    type: Type.OBJECT,
                    properties: {
                        numeroRegistro: withAIExtraSchema(Type.STRING, "IMMEX registration number."),
                        modalidad: withAIExtraSchema(Type.STRING, "IMMEX modality (e.g., Industrial, Servicios)."),
                        fechaAutorizacion: withAIExtraSchema(Type.STRING, "IMMEX authorization date (YYYY-MM-DD).")
                    },
                    nullable: true,
                },
                prosec: {
                     type: Type.OBJECT,
                    properties: {
                        numeroRegistro: withAIExtraSchema(Type.STRING, "PROSEC registration number."),
                        sector: withAIExtraSchema(Type.STRING, "PROSEC sector."),
                        fechaAutorizacion: withAIExtraSchema(Type.STRING, "PROSEC authorization date (YYYY-MM-DD).")
                    },
                    nullable: true,
                }
            }
        },
        miembros: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    nombre: withAIExtraSchema(Type.STRING, "Full name of the board member or partner."),
                    rfc: withAIExtraSchema(Type.STRING, "Tax ID (RFC) of the member.")
                }
            },
             nullable: true,
        },
        domicilios: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    direccionCompleta: withAIExtraSchema(Type.STRING, "Full address of an operational facility."),
                    telefono: withAIExtraSchema(Type.STRING, "Phone number for the facility.")
                }
            },
             nullable: true,
        },
        agentesAduanales: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    nombre: withAIExtraSchema(Type.STRING, "Name of the customs agent or agency."),
                    numeroPatente: withAIExtraSchema(Type.STRING, "Customs patent number.")
                }
            },
            nullable: true,
        }
    }
};

export const extractCompanyDataFromDocument = async (file: {
    base64: string;
    mimeType: string;
}): Promise<AIExtractedCompany> => {
     if (!process.env.API_KEY) {
        throw new Error("AI Assistant is not configured. Missing API Key.");
    }

    const systemInstruction = `You are an expert data extraction AI. Your task is to analyze the provided document and extract key information about a company.
Carefully read the document and populate the JSON schema with the information you find.
For each field, you MUST provide:
1.  'value': The extracted data point.
2.  'confidence': A score from 0.0 to 1.0 indicating your confidence in the accuracy of the value.
3.  'source': The exact text snippet from the document where you found the value.
If you cannot find a specific piece of information, leave its 'value' field as an empty string "" and set 'confidence' to 0.0.
Do not invent or infer information that isn't present in the text.`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: file.base64, mimeType: file.mimeType } },
                    { text: "Please extract the company information from this document." }
                ],
            },
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: companyDataSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIExtractedCompany;

    } catch (error) {
        console.error("Error calling Gemini API for data extraction:", error);
        if (error instanceof Error) {
            throw new Error(`AI data extraction failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI data extraction.");
    }
};
