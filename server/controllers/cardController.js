import { GoogleGenerativeAI } from '@google/generative-ai';
import GreetingCard from '../models/GreetingCard.js';
import Analytics from '../models/Analytics.js';
import mongoose from 'mongoose';

// Simple in-memory fallback database for cards and analytics in case MongoDB is offline
export const memoryCards = [
  {
    _id: "666e1234567890abcdef0001",
    occasion: "Birthday",
    tone: "Funny",
    recipient: "Amit",
    sender: "Ravi",
    length: "Medium",
    language: "English",
    title: "Another Year of Wisdom (or Lack Thereof)",
    content: "Happy Birthday Amit! You're not getting older, you're just becoming a classic. Like a fine wine, or a vintage car, or a piece of cheese left in the fridge too long. Hope your day is filled with lots of cake and zero calculations of your actual age. Cheers, Ravi!",
    caption: "Older? Yes. Wiser? Debatable. Happy Birthday, Amit! 🎂",
    giftTag: "To Amit, From Ravi. Wishing you cake and chaos!",
    template: "modern",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    _id: "666e1234567890abcdef0002",
    occasion: "Anniversary",
    tone: "Romantic",
    recipient: "Priya",
    sender: "Rohan",
    length: "Medium",
    language: "English",
    title: "To My Forever",
    content: "Happy Anniversary, Priya! Every day spent with you feels like a beautiful dream come true. You are my laughter, my anchor, and my best friend. Thank you for sharing your life, your love, and your heart with me. Here's to forever, Rohan.",
    caption: "Years fly by when you're with your favorite human. Happy Anniversary! ❤️",
    giftTag: "To Priya, From Rohan. Forever and always.",
    template: "romantic",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    _id: "666e1234567890abcdef0003",
    occasion: "Corporate Appreciation",
    tone: "Professional",
    recipient: "Tech Team",
    sender: "CEO",
    length: "Short",
    language: "English",
    title: "Outstanding Contribution",
    content: "Dear Tech Team, thank you for your exceptional commitment to delivering this project. Your engineering expertise and dedication have set a new benchmark for excellence. We appreciate everything you do.",
    caption: "Big shoutout to our Tech Team for their hard work! 🚀",
    giftTag: "Thank you for driving success. - CEO",
    template: "corporate",
    createdAt: new Date()
  }
];

export const memoryAnalytics = [
  { occasion: "Birthday", tone: "Funny", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { occasion: "Anniversary", tone: "Romantic", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { occasion: "Corporate Appreciation", tone: "Professional", date: new Date() }
];

// Helper to check if DB is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Generates Mock fallback data when Gemini API key is missing or calls fail
const generateMockCard = (occasion, tone, recipient, sender, length, language) => {
  const isHindi = language.toLowerCase() === 'hindi';
  
  if (isHindi) {
    return {
      title: `${recipient} के लिए विशेष शुभकामना`,
      content: `प्रिय ${recipient}, इस ${occasion} के पावन अवसर पर मेरी ओर से हार्दिक शुभकामनाएं। भगवान करे कि आपका यह दिन खुशियों से भरा हो और आपकी जिंदगी में हमेशा खुशहाली रहे। आपका दिन मंगलमय हो! शुभकामनाओं के साथ, ${sender}।`,
      caption: `${occasion} की हार्दिक शुभकामनाएं! ✨`,
      giftTag: `प्रिय ${recipient} के लिए, ${sender} की तरफ से।`
    };
  }

  // English fallback template builder
  let title = `Special ${occasion} Wishes for ${recipient}`;
  let content = `Dear ${recipient}, on this special ${occasion}, I wanted to send you my warmest thoughts. `;
  let caption = `Wishing you a wonderful ${occasion}! 🎉`;
  let giftTag = `To ${recipient}, From ${sender}. Warmest wishes.`;

  if (occasion === 'Birthday') {
    title = `Happy Birthday, ${recipient}!`;
    if (tone === 'Funny') {
      content = `Happy Birthday, ${recipient}! They say that age is just a number, but in your case, it's a really high one. Don't worry, you still look half your age—mainly because I'm looking at you with half-closed eyes. Have a blast! Cheers, ${sender}.`;
      caption = `Cheers to another year of survival, ${recipient}! 🥂`;
    } else if (tone === 'Romantic') {
      content = `Happy Birthday to the love of my life, ${recipient}. Your smile brightens my world, and your love makes every day magical. I hope this birthday brings you as much happiness as you bring to me. Loving you always, ${sender}.`;
      caption = `Happy Birthday to my favorite person. ❤️`;
    } else {
      content = `Happy Birthday, ${recipient}! Wishing you a year ahead filled with joy, prosperity, and amazing moments. May all your dreams and aspirations come true. Enjoy your special day! Warm regards, ${sender}.`;
    }
  } else if (occasion === 'Anniversary') {
    title = `Happy Anniversary!`;
    if (tone === 'Romantic') {
      content = `Happy Anniversary, ${recipient}! Life with you is an incredible adventure. I love you more and more with each passing year, and I'm so grateful to have you by my side. Here's to us, ${sender}.`;
      caption = `Celebrating another year of love and laughter. 💖`;
    } else {
      content = `Happy Anniversary, ${recipient}! Wishing you both a beautiful day as you celebrate another year of marriage. May your love continue to grow stronger with each passing day. Best wishes, ${sender}.`;
    }
  } else if (occasion === 'Corporate Appreciation') {
    title = `Thank You for Your Hard Work`;
    content = `Dear ${recipient}, we wanted to express our sincere appreciation for your hard work and dedication. Your contributions have been instrumental to our team's success. Thank you for your continued excellence. Best, ${sender}.`;
    caption = `A big thank you to ${recipient} for their dedication! 💼`;
  }

  // Adjust length
  if (length === 'Short') {
    content = content.split('.').slice(0, 2).join('.') + '.';
  } else if (length === 'Long') {
    content += ` May this day mark the start of a fantastic chapter ahead, overflowing with laughter, success, and peace. Remember to celebrate to the fullest and cherish every single moment!`;
  }

  return { title, content, caption, giftTag };
};

// Generate Card using Gemini API
export const generateCard = async (req, res, next) => {
  try {
    const { occasion, tone, recipient, sender, length, language, template } = req.body;

    if (!occasion || !tone || !recipient || !sender) {
      res.status(400);
      throw new Error('Please fill all required fields: occasion, tone, recipient, sender');
    }

    let cardData;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using recommended gemini-1.5-flash model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are an expert copywriter and greeting card designer. 
Generate a personalized greeting card based on the following specifications:
- Occasion: ${occasion}
- Tone: ${tone}
- Recipient Name: ${recipient}
- Sender Name: ${sender}
- Message Length: ${length} (Short = ~1-2 sentences, Medium = ~3-5 sentences, Long = ~6+ sentences)
- Language: ${language} (Write the entire content, title, caption, and gift tag in the selected language. If language is Hindi, use Devnagari script)

You must output a raw, valid JSON object containing exactly the following keys, with no markdown tags or wrapper format:
{
  "title": "A short, beautiful, occasion-specific card title/headline",
  "content": "The main greeting card message. Make it flow naturally, sound human-written, and pack it with appropriate emotions fitting the requested tone.",
  "caption": "A concise, engaging caption (e.g. for sharing or social media, with emojis)",
  "giftTag": "A brief gift tag message, formatted clearly (e.g. To: ..., From: ... [short greeting])"
}`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        
        // Clean markdown backticks if Gemini returned them
        const cleanedText = text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        cardData = JSON.parse(cleanedText);
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to templates:', geminiError.message);
        cardData = generateMockCard(occasion, tone, recipient, sender, length, language);
      }
    } else {
      console.log('No GEMINI_API_KEY found, using local template engine.');
      cardData = generateMockCard(occasion, tone, recipient, sender, length, language);
    }

    // Save to DB if connected, otherwise save in memory
    const finalCard = {
      occasion,
      tone,
      recipient,
      sender,
      length,
      language,
      title: cardData.title,
      content: cardData.content,
      caption: cardData.caption,
      giftTag: cardData.giftTag,
      template: template || 'minimalist',
    };

    if (isDbConnected()) {
      const savedCard = await GreetingCard.create(finalCard);
      
      // Log Analytics
      await Analytics.create({
        cardId: savedCard._id,
        occasion,
        tone,
      });

      return res.status(201).json({
        success: true,
        data: savedCard,
      });
    } else {
      // Memory Storage Fallback
      const mockId = new mongoose.Types.ObjectId().toString();
      const memorySavedCard = {
        _id: mockId,
        ...finalCard,
        createdAt: new Date(),
      };
      memoryCards.unshift(memorySavedCard);
      
      memoryAnalytics.unshift({
        occasion,
        tone,
        date: new Date()
      });

      return res.status(201).json({
        success: true,
        data: memorySavedCard,
        note: "Saved in temporary memory storage (MongoDB not connected)",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get All Cards with Filters and Search
export const getCards = async (req, res, next) => {
  try {
    const { search, occasion, tone } = req.query;
    
    if (isDbConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { recipient: { $regex: search, $options: 'i' } },
          { sender: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
        ];
      }

      if (occasion && occasion !== 'All') {
        query.occasion = occasion;
      }

      if (tone && tone !== 'All') {
        query.tone = tone;
      }

      const cards = await GreetingCard.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: cards.length,
        data: cards,
      });
    } else {
      // Memory query fallback
      let filteredCards = [...memoryCards];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredCards = filteredCards.filter(
          (c) =>
            c.recipient.toLowerCase().includes(searchLower) ||
            c.sender.toLowerCase().includes(searchLower) ||
            c.title.toLowerCase().includes(searchLower)
        );
      }

      if (occasion && occasion !== 'All') {
        filteredCards = filteredCards.filter((c) => c.occasion === occasion);
      }

      if (tone && tone !== 'All') {
        filteredCards = filteredCards.filter((c) => c.tone === tone);
      }

      return res.status(200).json({
        success: true,
        count: filteredCards.length,
        data: filteredCards,
        note: "Data fetched from temporary memory (MongoDB not connected)",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get Single Card by ID
export const getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const card = await GreetingCard.findById(id);
      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }
      return res.status(200).json({
        success: true,
        data: card,
      });
    } else {
      const card = memoryCards.find((c) => c._id === id);
      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }
      return res.status(200).json({
        success: true,
        data: card,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete Card by ID
export const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const card = await GreetingCard.findByIdAndDelete(id);
      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }
      
      // Delete corresponding analytics records
      await Analytics.deleteMany({ cardId: id });

      return res.status(200).json({
        success: true,
        message: 'Greeting card deleted successfully',
      });
    } else {
      const cardIndex = memoryCards.findIndex((c) => c._id === id);
      if (cardIndex === -1) {
        res.status(404);
        throw new Error('Greeting card not found');
      }
      memoryCards.splice(cardIndex, 1);
      return res.status(200).json({
        success: true,
        message: 'Greeting card deleted successfully from memory',
      });
    }
  } catch (error) {
    next(error);
  }
};
