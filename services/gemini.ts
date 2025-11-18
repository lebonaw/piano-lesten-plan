import { GoogleGenAI, Type } from "@google/genai";
import { PianoCourse } from "../types";

// The exact prompt requested by the user, wrapped for JSON output
const SYSTEM_INSTRUCTION = `You are an expert piano teacher with 20 years of experience teaching beginners. 
Your goal is to create structured, encouraging, and highly effective lesson plans.
Identify as Maestro AI.`;

const PROMPT_TEMPLATE = `
Create a 4-week beginner piano lesson plan for someone with no previous experience. 
Include daily practice routines (20–30 minutes), essential skills to learn each week, simple exercises, and recommended beginner songs. 
Break it down by week and by day (assume 5 practice days per week). 
Make it easy to follow and focused on fast progress. 
Also include tips for proper hand posture, reading music, and basic music theory.
`;

export const generateLessonPlan = async (): Promise<PianoCourse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PROMPT_TEMPLATE,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the course" },
            description: { type: Type.STRING, description: "A brief encouraging overview" },
            tips: {
              type: Type.OBJECT,
              properties: {
                posture: { type: Type.STRING, description: "Key tips for posture" },
                readingMusic: { type: Type.STRING, description: "Basics of reading music" },
                handPosition: { type: Type.STRING, description: "Hand shape and finger numbering tips" },
              },
              required: ["posture", "readingMusic", "handPosition"]
            },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  goal: { type: Type.STRING, description: "The main objective for this week" },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dayNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING, description: "Theme of the day" },
                        timeEstimate: { type: Type.STRING, description: "e.g., '25 mins'" },
                        exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
                        songs: { type: Type.ARRAY, items: { type: Type.STRING } },
                        theoryFocus: { type: Type.STRING },
                        practiceRoutine: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Step by step bullet points for the daily session"
                        }
                      },
                      required: ["dayNumber", "title", "timeEstimate", "exercises", "practiceRoutine"]
                    }
                  }
                },
                required: ["weekNumber", "theme", "goal", "days"]
              }
            }
          },
          required: ["title", "description", "weeks", "tips"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as PianoCourse;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};