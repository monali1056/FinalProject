import { useEffect } from "react";
import { contactService } from "../services/api";

export default function WatsonChat() {
  useEffect(() => {
    // ── Watson Assistant config ───────────────────────────────────────────────
    window.watsonAssistantChatOptions = {
      integrationID:     "f90367be-7cea-4a01-b76c-91d4dc3385fd",
      region:            "https://integrations.au-syd.assistant.watson.appdomain.cloud",
      serviceInstanceID: "fa3115f9-555c-4fcc-bd40-3b4cf47904bd",

      onLoad: async (instance) => {
        await instance.render();

        // ── Listen to every user message sent in Watson chat ─────────────────
        instance.on({
          type: "send",
          handler: async (event) => {
            try {
              const userMessage = event?.data?.input?.text;
              if (!userMessage || userMessage.trim() === "") return;

              // Save every user message as an enquiry to your backend (Cloudant)
              await contactService.submit({
                name:    "Watson Chat User",
                email:   "watson-enquiry@rentease.ai",
                subject: "Watson Chatbot Enquiry",
                message: userMessage,
                source:  "watson_chatbot",
                timestamp: new Date().toISOString(),
              });
            } catch (err) {
              // Silent fail — don't interrupt the chat experience
              console.warn("Watson enquiry save failed:", err.message);
            }
          },
        });

        // ── Listen to conversation end / chat closed ──────────────────────────
        instance.on({
          type: "window:close",
          handler: async () => {
            try {
              await contactService.submit({
                name:    "Watson Chat User",
                email:   "watson-enquiry@rentease.ai",
                subject: "Watson Chat Session Ended",
                message: "A user completed a Watson chat session.",
                source:  "watson_chatbot_session",
                timestamp: new Date().toISOString(),
              });
            } catch (err) {
              console.warn("Watson session save failed:", err.message);
            }
          },
        });
      },
    };

    // ── Inject Watson script ──────────────────────────────────────────────────
    const script = document.createElement("script");
    script.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (window.watsonAssistantChatOptions.clientVersion || "latest") +
      "/WatsonAssistantChatEntry.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}
