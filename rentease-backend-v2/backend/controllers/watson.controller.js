const fetch = require("node-fetch");

/**
 * POST /api/watson/message
 * Proxies chat messages to IBM Watson Assistant v2
 * Falls back to smart keyword matching if Watson is not configured
 */
async function sendMessage(req, res) {
  const { message, sessionId } = req.body;

  if (!message)
    return res.status(400).json({ error: "message is required." });

  // ── Try real IBM Watson Assistant if configured ────────────────────────────
  const {
    WATSON_ASSISTANT_API_KEY,
    WATSON_ASSISTANT_URL,
    WATSON_ASSISTANT_ID,
  } = process.env;

  if (WATSON_ASSISTANT_API_KEY && WATSON_ASSISTANT_URL && WATSON_ASSISTANT_ID) {
    try {
      const AssistantV2 = require("ibm-watson/assistant/v2");
      const { IamAuthenticator } = require("ibm-cloud-sdk-core");

      const assistant = new AssistantV2({
        version:       "2021-11-27",
        authenticator: new IamAuthenticator({ apikey: WATSON_ASSISTANT_API_KEY }),
        serviceUrl:    WATSON_ASSISTANT_URL,
      });

      // Create session if none provided
      let sid = sessionId;
      if (!sid) {
        const sessRes = await assistant.createSession({ assistantId: WATSON_ASSISTANT_ID });
        sid = sessRes.result.session_id;
      }

      const msgRes = await assistant.message({
        assistantId: WATSON_ASSISTANT_ID,
        sessionId:   sid,
        input:       { message_type: "text", text: message },
      });

      const reply = msgRes.result.output.generic
        .filter((g) => g.response_type === "text")
        .map((g) => g.text)
        .join("\n");

      return res.json({
        reply,
        sessionId: sid,
        source:    "ibm-watson",
      });
    } catch (err) {
      console.error("Watson API error:", err.message, "— falling back to local NLP");
    }
  }

  // ── Fallback: local keyword NLP (mirrors frontend WatsonChat.jsx) ─────────
  const reply = getLocalReply(message);
  res.json({ reply, sessionId: null, source: "local-nlp" });
}

function getLocalReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes("recommend") || m.includes("suggest"))
    return "Based on your location, I'd recommend our Honda City (₹2,499/mo) or Samsung AC (₹899/mo). Both are top-rated! Shall I check availability? 🚗❄️";
  if (m.includes("book") || m.includes("how") || m.includes("process"))
    return "Booking is simple! 1️⃣ Browse products → 2️⃣ Click 'Rent Now' → 3️⃣ Choose duration → 4️⃣ Pay securely. Need help with a specific product?";
  if (m.includes("pric") || m.includes("cost") || m.includes("cheap"))
    return "Our rentals start at just ₹299/month! All plans include: ✅ Free delivery ✅ Installation ✅ Maintenance. No hidden charges!";
  if (m.includes("ac") || m.includes("air condition") || m.includes("cool"))
    return "For ACs I recommend: Samsung 1.5T Split AC at ₹899/mo (up to 150 sq ft) or LG 2T at ₹1,099/mo (up to 200 sq ft). Both include free installation! ❄️";
  if (m.includes("car") || m.includes("vehicle") || m.includes("honda"))
    return "Top car picks: 🚗 Honda City 2023 — ₹2,499/mo | 🚗 Maruti Swift — ₹1,799/mo | 🛵 Ola Scooter — ₹1,799/mo. All include insurance!";
  if (m.includes("sofa") || m.includes("bed") || m.includes("furniture"))
    return "Our furniture bundles: 🛋️ Sofa Set from ₹1,199/mo | 🛏️ King Bed from ₹899/mo | 🪑 Office Chair from ₹499/mo. Free assembly included!";
  if (m.includes("help") || m.includes("support"))
    return "I can help you with:\n• 🏷️ Product recommendations\n• 📅 Booking assistance\n• 💰 Pricing info\n• 🚚 Delivery timelines\n\nWhat do you need?";
  return "Thanks for reaching out! Which category interests you? 🚗 Vehicles | ❄️ Appliances | 🛋️ Furniture | 💻 Electronics";
}

module.exports = { sendMessage };
