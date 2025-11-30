import { GoogleGenerativeAI } from "@google/generative-ai";
import { JournalEntry } from "../types";

// เรียกใช้ API Key แบบ Vite (ถ้าไม่มี Key จะไม่ Error ทันที แต่จะแจ้งเตือน)
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn("Missing VITE_GOOGLE_API_KEY in environment variables");
}

export const analyzeTradeEntry = async (entry: JournalEntry): Promise<string> => {
  if (!genAI) {
    return "ไม่พบ API Key กรุณาตั้งค่า VITE_GOOGLE_API_KEY ใน Vercel";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      ช่วยวิเคราะห์การเทรดนี้ให้หน่อย ในฐานะ Professional Trader Mentor:
      
      Symbol: ${entry.symbol}
      Side: ${entry.side}
      Result: ${entry.resultType} (${entry.pnlAmount})
      Logic: ${entry.logic}
      Mistakes: ${entry.mistakes || '-'}
      
      ขอคำแนะนำสั้นๆ 3 ข้อ เพื่อพัฒนาการเทรดครั้งต่อไป:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing trade:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};
