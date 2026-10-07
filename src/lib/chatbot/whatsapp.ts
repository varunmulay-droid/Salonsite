import { business } from "@/data/chatbot";
import { serviceBySlug } from "@/lib/salon-data";
import { chatHouses } from "@/data/chatbot";

export type EnquiryType = "booking" | "consultation" | "quote" | "general";

export type EnquiryFields = {
  selectedService?: string;
  selectedHouse?: string;
  selectedDate?: string;
  selectedTime?: string;
  customerName?: string;
  enquiryType?: EnquiryType;
  occasion?: string;
};

/** Builds the pre-filled enquiry text from the conversation state. */
export function generateWhatsAppMessage(state: EnquiryFields): string {
  const service = state.selectedService ? serviceBySlug(state.selectedService) : undefined;
  const house = chatHouses.find((h) => h.slug === state.selectedHouse);

  if (!service && !state.selectedDate && !state.selectedTime && !house) {
    return `Hello ${business.name}, I'd like to ask about your services.`;
  }

  const topic = service ? service.name : "your services";
  const lead =
    state.enquiryType === "consultation"
      ? `Hello, I would like to book a consultation for ${topic}.`
      : state.enquiryType === "quote"
        ? `Hello, I would like an exact quote for ${topic}.`
        : `Hello, I would like to enquire about ${topic}.`;

  const lines = [lead];
  if (state.occasion) lines.push(`Occasion: ${state.occasion}`);
  lines.push(`Preferred house: ${house ? `${house.city} (${house.neighbourhood})` : "Not specified"}`);
  lines.push(`Preferred date: ${state.selectedDate || "Not specified"}`);
  lines.push(`Preferred time: ${state.selectedTime || "Not specified"}`);
  if (state.customerName) lines.push(`Name: ${state.customerName}`);
  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string, phone: string = business.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsAppHref(state: EnquiryFields): string {
  return buildWhatsAppUrl(generateWhatsAppMessage(state));
}
