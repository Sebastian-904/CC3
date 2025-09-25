import { GoogleGenAI, Type } from "@google/genai";
import { AIExtractedCompany } from "../lib/types";

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