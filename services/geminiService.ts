
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Trainer, WorkoutPlan } from "../types";

// Always use process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Renamed to correct spelling: getAIRecommendation
export const getAIRecommendation = async (profile: UserProfile, trainers: Trainer[]): Promise<string> => {
  const trainerBios = trainers.map(t => `${t.name}: Specialties: ${t.specialties.join(", ")}. Bio: ${t.bio}`).join("\n\n");

  const prompt = `
    You are a professional fitness concierge. Given a user's fitness profile and a list of available personal trainers, recommend the top 2 best-fitting trainers.
    
    User Profile:
    - Level: ${profile.fitnessLevel}
    - Goals: ${profile.goals.join(", ")}
    - Preferred Specialties: ${profile.preferredSpecialties.join(", ")}
    
    Trainers:
    ${trainerBios}
    
    Provide a concise, motivating explanation for each recommendation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Use .text property as per guidelines (not .text())
    return response.text || "I couldn't generate a recommendation at this time. Please browse our trainers manually.";
  } catch (error) {
    console.error("Gemini AI Recommendation Error:", error);
    return "Something went wrong with our AI service. Please try again later.";
  }
};

export const generateWorkoutPlan = async (profile: UserProfile, equipment: string): Promise<WorkoutPlan | null> => {
  const prompt = `Generate a personalized workout plan for a ${profile.fitnessLevel} user with goals: ${profile.goals.join(", ")}. Available equipment: ${equipment}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "sets", "reps", "description"]
              }
            }
          },
          required: ["title", "summary", "exercises"]
        }
      }
    });

    // Access .text property directly
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini AI Workout Gen Error:", error);
    return null;
  }
};
