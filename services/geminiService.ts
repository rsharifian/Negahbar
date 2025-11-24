
import { GoogleGenAI } from "@google/genai";
import { Product, MovementLog } from "../types";

const getSystemInstruction = (inventory: Product[], logs: MovementLog[]) => {
  const inventorySummary = inventory.map(p => `${p.name} (Qty: ${p.quantity})`).join(', ');
  
  return `
    شما دستیار هوشمند انبارداری برای شرکت "نگهبار" (Negahbar) هستید. 
    نگهبار یک انبار پیشرفته در درچه اصفهان است که به آنلاین‌شاپ‌های سراسر ایران خدمات می‌دهد.
    
    وظایف شما:
    1. تحلیل موجودی انبار و پیشنهاد سفارش مجدد.
    2. ارائه مشاوره در مورد بسته‌بندی و ارسال بهینه.
    3. پاسخ به سوالات لجستیکی.
    4. اگر کاربر تصویری (مثل لیست سفارش یا عکس کالا) ارسال کرد، آن را تحلیل کنید و اطلاعاتش را استخراج کنید.
    
    داده‌های فعلی انبار:
    ${inventorySummary}
    
    لحن پاسخگویی: حرفه‌ای، مختصر و مفید به زبان فارسی.
    همیشه راهکارهایی ارائه دهید که هزینه‌ها را کاهش و سرعت ارسال را افزایش دهد.
  `;
};

export const getWarehouseAdvice = async (
  prompt: string, 
  inventory: Product[], 
  logs: MovementLog[],
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "خطا: کلید API یافت نشد. لطفاً تنظیمات محیطی را بررسی کنید.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const parts: any[] = [{ text: prompt }];
    if (imagePart) {
      parts.unshift(imagePart);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash as it supports multimodal
      contents: { parts: parts },
      config: {
        systemInstruction: getSystemInstruction(inventory, logs),
        temperature: 0.7,
      }
    });

    return response.text || "پاسخی دریافت نشد.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "متاسفانه در برقراری ارتباط با هوش مصنوعی مشکلی پیش آمده است.";
  }
};
