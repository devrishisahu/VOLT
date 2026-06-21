import { GoogleGenAI } from "@google/genai";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";

const askVoltBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required.");
  }

  // 1. Rate Limiting Check
  const user = await User.findById(req.user._id);
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  // Filter out queries older than 12 hours
  user.voltbotQueries = user.voltbotQueries.filter(date => date >= twelveHoursAgo);

  if (user.voltbotQueries.length >= 25) {
    res.status(429);
    throw new Error("You have reached your limit of 25 questions per 12 hours. Please try again later.");
  }

  // 2. Add current query timestamp
  user.voltbotQueries.push(now);
  await user.save();

  // 3. AI Integration
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch live events to feed into the AI
    const liveEvents = await Event.find({ isActive: true }).select('title eventDate eventLocation eventArtistName ticketPrice genre duration');
    const eventsContext = liveEvents.map(e => `- ${e.title} by ${e.eventArtistName} in ${e.eventLocation} on ${e.eventDate}. Genre: ${e.genre || 'N/A'}. Price: ₹${e.ticketPrice}.`).join('\n');

    const systemPrompt = `You are VoltBot, an AI assistant for the VOLT live concert ticketing app. 
You ONLY answer questions about concerts, events, ticketing, artists, and the VOLT platform itself.
If the user asks anything outside of this context (like programming, general knowledge, recipes, etc), 
politely decline and remind them you are here to help with VOLT events. Be concise and energetic!

Here are the current live events available on VOLT right now:
${eventsContext || 'No live events are currently scheduled.'}

Use this information to answer user questions accurately. Do not make up events that are not in this list.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const response = await chat.sendMessage({ message: message });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("VoltBot Error:", error);
    res.status(500);
    throw new Error("VoltBot is currently offline or experiencing issues.");
  }
};

const chatController = { askVoltBot };
export default chatController;