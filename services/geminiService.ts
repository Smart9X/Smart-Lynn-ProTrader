import { GoogleGenAI } from "@google/genai";
import { JournalEntry } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTradeEntry = async (entry: JournalEntry): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "ไม่พบ API Key กรุณาตั้งค่าเพื่อใช้งานฟีเจอร์ AI Analysis";
  }

  const prompt = `
    Role: Professional Trading Coach.
    Task: Analyze this trading journal entry and provide short, constructive feedback (in Thai).
    
    Trade Data:
    - Symbol: ${entry.symbol} (${entry.side})
    - Context: Market ${entry.marketCondition}, Emotion: ${entry.emotion}, Confidence: ${entry.confidence}%
    - Setup: Entry ${entry.entryPrice}, SL ${entry.stopLoss}, TP ${entry.takeProfit}
    - Result: ${entry.resultType} (${entry.pnlAmount})
    - Logic: ${entry.logic}
    - Mistakes: ${entry.mistakes}
    - Review: Followed Plan? ${entry.followedPlan ? 'Yes' : 'No'}. Moved SL/TP? ${entry.movedSLTP ? 'Yes' : 'No'}.

    Please provide feedback on:
    1. Risk Management (R:R ratio based on Entry, SL, TP).
    2. Psychology (Connection between emotion and result).
    3. Technical Execution (Based on logic and mistakes).
    4. Actionable Advice for next trade.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};