/*
  Almaz Assistant — a lightweight, rule-based chat widget.
  It answers common questions from a fixed set of facts about the cafe
  (hours, address, menu, halal/vegetarian options, parking, etc).
  It does NOT call any external AI service — everything runs in the
  browser, so there's nothing to configure or pay for. If you later want
  it backed by a real AI model, see the note at the bottom of this file.
*/

(function () {
  const FACTS = {
    hours: "We're open every day, 11:00am – 9:00pm, including public holidays unless posted otherwise.",
    address: "157 Onehunga Mall, Onehunga, Auckland 1061 — on the main street, close to Dress Smart.",
    phone: "You can call us on (09) 622 2108.",
    cuisine: "Turkish, Middle Eastern and Mediterranean food, with a few Persian specials like lamb pasendeh.",
    halal: "Yes — our meat is halal.",
    vegetarian: "Yes, we've got vegetarian options (like samosas, spanakopita, hummus and falafel) and vegan options too — just ask your server.",
    byo: "Yes, we're BYO.",
    parking: "There's free street parking right outside on Onehunga Mall.",
    wheelchair: "Yes, the cafe has wheelchair-accessible entry and seating.",
    delivery: "You can order delivery or pickup through Uber Eats or DoorDash, or call us directly on (09) 622 2108 for takeaway.",
    payment: "We take credit cards, debit cards, and contactless/NFC payments.",
    groups: "We can seat larger groups and can host private functions for up to about 40 people — give us a call on (09) 622 2108 to arrange it.",
    popular: "Customer favourites are the lamb, chicken and mixed kebabs, the lamb souvlaki, the Almaz platter, and the lamb pasendeh from our Persian specials. Baklava and Turkish coffee are a popular way to finish.",
    price: "Most people spend around $10–20 per person.",
    rating: "We're rated 4.2 out of 5 from 222+ Google reviews.",
  };

  const RULES = [
    { keys: ["hour", "open", "close", "time"], fact: "hours" },
    { keys: ["address", "where", "location", "find"], fact: "address" },
    { keys: ["phone", "number", "call", "contact"], fact: "phone" },
    { keys: ["halal"], fact: "halal" },
    { keys: ["vegetarian", "vegan", "plant"], fact: "vegetarian" },
    { keys: ["byo", "wine", "alcohol", "drink own"], fact: "byo" },
    { keys: ["park"], fact: "parking" },
    { keys: ["wheelchair", "accessible", "access"], fact: "wheelchair" },
    { keys: ["deliver", "uber", "doordash", "takeaway", "take away", "pickup", "pick up"], fact: "delivery" },
    { keys: ["pay", "card", "eftpos", "cash"], fact: "payment" },
    { keys: ["group", "function", "party", "book", "event", "catering", "cater"], fact: "groups" },
    { keys: ["popular", "best", "recommend", "favourite", "favorite", "special", "kebab"], fact: "popular" },
    { keys: ["price", "cost", "expensive", "cheap", "how much"], fact: "price" },
    { keys: ["rating", "review", "star"], fact: "rating" },
    { keys: ["cuisine", "food type", "turkish", "persian", "middle eastern"], fact: "cuisine" },
    { keys: ["menu", "what do you serve", "dish"], fact: "popular" },
  ];

  const SUGGESTIONS = [
    "What are your hours?",
    "Do you have vegan options?",
    "Is it halal?",
    "What's popular on the menu?",
    "Do you deliver?",
  ];

  function findAnswer(text) {
    const t = text.toLowerCase();
    for (const rule of RULES) {
      if (rule.keys.some((k) => t.includes(k))) {
        return FACTS[rule.fact];
      }
    }
    return "I'm not sure about that one — for anything specific it's best to call the cafe directly on (09) 622 2108, or check the Support page for more answers.";
  }

  function buildWidget() {
    const root = document.getElementById("almaz-chat-root");
    if (!root) return;

    root.innerHTML = `
      <button class="chat-launcher" id="chat-launcher" aria-expanded="false" aria-controls="chat-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4A9 9 0 0 1 3 12a8.4 8.4 0 0 1 15.5-5.6 8.4 8.4 0 0 1 2.5 5.1Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>
        Ask Almaz
      </button>
      <div class="chat-panel" id="chat-panel" role="dialog" aria-label="Almaz Assistant chat">
        <div class="chat-head">
          <div>
            <h4>Almaz Assistant</h4>
            <p>Quick answers about hours, menu &amp; more</p>
          </div>
          <button class="chat-close" id="chat-close" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-body" id="chat-body">
          <div class="chat-msg bot">Merhaba! 👋 Ask me about our hours, menu, halal/vegan options, parking, or anything else basic — I'll do my best.</div>
        </div>
        <div class="chat-suggestions" id="chat-suggestions"></div>
        <div class="chat-input-row">
          <input type="text" id="chat-input" placeholder="Type a question…" aria-label="Type a question" />
          <button id="chat-send">Send</button>
        </div>
        <p class="chat-disclaimer">Automated answers from cafe info — for anything urgent, call (09) 622 2108.</p>
      </div>
    `;

    const launcher = document.getElementById("chat-launcher");
    const panel = document.getElementById("chat-panel");
    const closeBtn = document.getElementById("chat-close");
    const body = document.getElementById("chat-body");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const suggestionsEl = document.getElementById("chat-suggestions");

    SUGGESTIONS.forEach((s) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = s;
      chip.addEventListener("click", () => sendMessage(s));
      suggestionsEl.appendChild(chip);
    });

    function toggle(open) {
      panel.classList.toggle("open", open);
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) input.focus();
    }

    launcher.addEventListener("click", () => toggle(!panel.classList.contains("open")));
    closeBtn.addEventListener("click", () => toggle(false));

    function addMessage(text, who) {
      const div = document.createElement("div");
      div.className = "chat-msg " + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function sendMessage(text) {
      const clean = text.trim();
      if (!clean) return;
      addMessage(clean, "user");
      input.value = "";
      setTimeout(() => addMessage(findAnswer(clean), "bot"), 250);
    }

    sendBtn.addEventListener("click", () => sendMessage(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage(input.value);
    });
  }

  document.addEventListener("DOMContentLoaded", buildWidget);
})();

/*
  Want this backed by a real language model instead of fixed answers?
  You'd need a small backend (e.g. a Netlify Function) that calls the
  Anthropic API with your own API key — never put an API key in this
  front-end file, since anyone could read and use it. Happy to build
  that Netlify Function version if you want to upgrade later.
*/
