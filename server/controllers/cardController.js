import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

// Unique mock ID generator for offline fallback simulation
const generateMockId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// In-memory fallback database for cards and analytics in case Supabase is offline
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
    template: "birthday",
    userId: "666e1234567890abcdef0009", // Regular user
    isFavorite: false,
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
    template: "anniversary",
    userId: "666e1234567890abcdef0009", // Regular user
    isFavorite: true,
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
    userId: "666e1234567890abcdef0000", // Admin user
    isFavorite: false,
    createdAt: new Date()
  }
];

export const memoryAnalytics = [
  { occasion: "Birthday", tone: "Funny", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { occasion: "Anniversary", tone: "Romantic", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { occasion: "Corporate Appreciation", tone: "Professional", date: new Date() }
];

// Generates Mock fallback data when Gemini API key is missing or calls fail
const hindiOccasionMap = {
  'Birthday': 'जन्मदिन',
  'Anniversary': 'वर्षगांठ',
  'Wedding': 'शादी',
  'Congratulations': 'बधाई',
  'Thank You': 'धन्यवाद',
  'Festival': 'त्यौहार',
  'Corporate Appreciation': 'सराहనా',
  'Friendship': 'मित्रता',
  'Farewell': 'विदाई'
};

const teluguOccasionMap = {
  'Birthday': 'పుట్టినరోజు',
  'Anniversary': 'వివాహ వార్షికోత్సవ',
  'Wedding': 'వివాహ',
  'Congratulations': 'అభినందనల',
  'Thank You': 'ధన్యవాదాల',
  'Festival': 'పండుగ',
  'Corporate Appreciation': 'కృతజ్ఞతల',
  'Friendship': 'స్నేహ',
  'Farewell': 'వీడ్కోలు'
};

const generateMockCard = (occasion, tone, recipient, sender, length, language) => {
  const isHindi = language.toLowerCase() === 'hindi';
  const isTelugu = language.toLowerCase() === 'telugu';
  
  if (isHindi) {
    const translatedOccasion = hindiOccasionMap[occasion] || occasion;
    return {
      title: `${recipient} के लिए विशेष ${translatedOccasion} शुभकामना`,
      content: `प्रिय ${recipient}, इस ${translatedOccasion} के पावन अवसर पर मेरी ओर से हार्दिक शुभकामनाएं। भगवान करे कि आपका यह दिन खुशियों से भरा हो और आपकी जिंदगी में हमेशा खुशहाली रहे। आपका दिन मंगलमय हो! शुभकामनाओं के साथ, ${sender}।`,
      caption: `${translatedOccasion} की हार्दिक शुभकामनाएं! ✨`,
      giftTag: `प्रिय ${recipient} के लिए, ${sender} की तरफ से।`
    };
  }

  if (isTelugu) {
    const translatedOccasion = teluguOccasionMap[occasion] || occasion;
    const occasionPhrase = occasion === 'Festival' ? 'పండుగ' : `${translatedOccasion} పండగ`;
    return {
      title: `${recipient} కి ప్రత్యేక ${translatedOccasion} శుభాకాంక్షలు`,
      content: `ప్రియమైన ${recipient}, ఈ ${occasionPhrase} సందర్భంగా నా హృదయపూర్వక శుభాకాంక్షలు. దేవుడు మీకు సంతోషాన్ని, ఆయురారోగ్యాలను ప్రసాదించాలని కోరుకుంటున్నాను. మీ జీవితం ఎల్లప్పుడూ ఆనందంగా సాగాలని ఆశిస్తున్నాను. శుభాకాంక్షలతో, ${sender}.`,
      caption: `${translatedOccasion} శుభాకాంక్షలు! ✨`,
      giftTag: `ప్రియమైన ${recipient} కి, ${sender} నుండి.`
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

    // Extract user ID optionally from Authorization header
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paper_plane_secret_jwt_key');
        userId = decoded.id;
      } catch (err) {
        console.log('Generating card as guest (invalid token)');
      }
    }

    let cardData;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are an expert copywriter and greeting card designer. 
Generate a personalized greeting card based on the following specifications:
- Occasion: ${occasion}
- Tone: ${tone}
- Recipient Name: ${recipient}
- Sender Name: ${sender}
- Message Length: ${length} (Short = ~1-2 sentences, Medium = ~3-5 sentences, Long = ~6+ sentences)
- Language: ${language} (Write the entire content, title, caption, and gift tag in the selected language. If language is Hindi, use Devnagari script; if Telugu, use Telugu script)

You must output a raw, valid JSON object containing exactly the following keys, with no markdown tags or wrapper format:
{
  "title": "A short, beautiful, occasion-specific card title/headline",
  "content": "The main greeting card message. Make it flow naturally, sound human-written, and pack it with appropriate emotions fitting the requested tone.",
  "caption": "A concise, engaging caption (e.g. for sharing or social media, with emojis)",
  "giftTag": "A brief gift tag message, formatted clearly (e.g. To: ..., From: ... [short greeting])"
}`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        
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
      cardData = generateMockCard(occasion, tone, recipient, sender, length, language);
    }

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
      userId,
      isFavorite: false
    };

    if (isSupabaseConfigured()) {
      const { data: savedCard, error: cardError } = await supabase
        .from('greeting_cards')
        .insert({
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
          userId: userId || null,
          isFavorite: false
        })
        .select('*')
        .single();

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Map id to _id for frontend compatibility
      const mappedCard = { _id: savedCard.id, ...savedCard };

      // Log Analytics
      await supabase.from('analytics').insert({
        cardId: savedCard.id,
        occasion,
        tone,
      });

      return res.status(201).json({
        success: true,
        data: mappedCard,
      });
    } else {
      // Memory Storage Fallback
      const mockId = generateMockId();
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
        note: "Saved in temporary memory storage (Supabase not connected)",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Generates Mock fallback data for memory cards when Gemini API key is missing or calls fail
const generateMockMemoryCard = (recipient, sender, description) => {
  let occasion = 'Memories';
  let tone = 'Nostalgic';
  let title = `Special Memory for ${recipient}`;
  let content = `Dear ${recipient},\n\nThinking back to that beautiful memory of: "${description}". It brings so much warmth and happiness to my heart. Thank you for always being such a special part of my life.\n\nWith all my love,\n${sender || 'Me'}`;
  let caption = `Cherishing beautiful memories with ${recipient}! ❤️✨`;
  let giftTag = `To ${recipient}, From ${sender || 'Me'}. Forever in my heart.`;

  const descLower = description.toLowerCase();
  if (descLower.includes('birthday') || descLower.includes('candles') || descLower.includes('cake') || descLower.includes('born')) {
    occasion = 'Birthday';
    title = `Happy Birthday, ${recipient}!`;
    content = `Dear ${recipient},\n\nHappy Birthday! Thinking back to that wonderful memory of: ${description}. Seeing you surrounded by so much joy and laughter is truly beautiful. May your day be filled with cake, warmth, and brand new memories to cherish!\n\nWarmest wishes,\n${sender || 'Me'}`;
    caption = `Wishing a very happy birthday to ${recipient}! 🎂✨`;
  } else if (descLower.includes('anniversary') || descLower.includes('wedding') || descLower.includes('marry') || descLower.includes('love')) {
    occasion = 'Anniversary';
    title = `Happy Anniversary, ${recipient}!`;
    content = `Dear ${recipient},\n\nHappy Anniversary! Celebrating this special milestone and reflecting on our memory of: ${description}. Every single moment with you is a treasure, and I am so grateful for all the love and laughter we share.\n\nWith all my love,\n${sender || 'Me'}`;
    caption = `Celebrating love and beautiful memories. Happy Anniversary! 💖`;
  } else if (descLower.includes('thank') || descLower.includes('grateful') || descLower.includes('appreciate')) {
    occasion = 'Thank You';
    title = `Heartfelt Thanks, ${recipient}!`;
    content = `Dear ${recipient},\n\nI just wanted to say a sincere thank you. Remembering our memory of: ${description} and feeling so incredibly grateful to have you in my life. Thank you for your kindness, support, and friendship.\n\nWith gratitude,\n${sender || 'Me'}`;
    caption = `Feeling incredibly grateful for you, ${recipient}! 🙏✨`;
  } else if (descLower.includes('congratulations') || descLower.includes('graduate') || descLower.includes('job') || descLower.includes('won')) {
    occasion = 'Congratulations';
    title = `Congratulations, ${recipient}!`;
    content = `Dear ${recipient},\n\nSending you the warmest congratulations! Remembering how amazing it was during ${description}. You worked so hard for this, and seeing you succeed is absolutely inspiring. So proud of you!\n\nWarmest regards,\n${sender || 'Me'}`;
    caption = `Huge congratulations to ${recipient}! So well deserved! 🎉👏`;
  }

  return { occasion, tone, title, content, caption, giftTag };
};

// Generate Card from Memory (Multimodal Gemini)
export const generateMemoryCard = async (req, res, next) => {
  try {
    const { image, recipient, description, sender, template } = req.body;

    if (!recipient || !description) {
      res.status(400);
      throw new Error('Please fill all required fields: recipient, description');
    }

    // Extract user ID optionally from Authorization header
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paper_plane_secret_jwt_key');
        userId = decoded.id;
      } catch (err) {
        console.log('Generating card as guest (invalid token)');
      }
    }

    let cardData;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are an expert copywriter and greeting card designer.
Analyze the uploaded image and the description of the memory to compose a beautiful greeting card:
- Memory description: "${description}"
- Recipient Name: "${recipient}"
- Sender Name: "${sender || 'Someone who loves you'}"

Based on this memory, write a highly personal and warm greeting. You must output a raw, valid JSON object containing exactly the following keys, with no markdown tags, no backticks, and no wrapper format:
{
  "title": "A short, beautiful, occasion-specific card title/headline (e.g., Happy 80th Birthday, Grandma!)",
  "content": "The main greeting card message. Make it flow naturally, sound human-written, emotional, personal, and reflect the memory details.",
  "caption": "A concise, engaging social media caption with emojis",
  "giftTag": "A brief gift tag message, e.g. To: ..., From: ... [short greeting]",
  "occasion": "The inferred occasion (e.g. Birthday, Anniversary, Wedding, Celebration, Friendship, Thank You, Festival, Farewell, Graduation)",
  "tone": "The inferred emotional tone (e.g. Emotional, Romantic, Nostalgic, Funny, Professional, Inspirational)"
}`;

        let promptPayload = [systemPrompt];
        
        if (image) {
          const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          let mimeType = 'image/jpeg';
          let base64Data = image;

          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
          }

          const imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          };
          promptPayload.push(imagePart);
        }

        const result = await model.generateContent(promptPayload);
        const text = result.response.text();
        
        const cleanedText = text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        cardData = JSON.parse(cleanedText);
      } catch (geminiError) {
        console.error('Gemini Multimodal API call failed, falling back to template simulation:', geminiError.message);
        cardData = generateMockMemoryCard(recipient, sender, description);
      }
    } else {
      cardData = generateMockMemoryCard(recipient, sender, description);
    }

    const finalCard = {
      occasion: cardData.occasion || 'Memories',
      tone: cardData.tone || 'Nostalgic',
      recipient,
      sender: sender || 'Me',
      length: 'Medium',
      language: 'English',
      title: cardData.title,
      content: cardData.content,
      caption: cardData.caption,
      giftTag: cardData.giftTag,
      template: template || 'birthday',
      imageUrl: image || null,
      userId,
      isFavorite: false
    };

    if (isSupabaseConfigured()) {
      const { data: savedCard, error: cardError } = await supabase
        .from('greeting_cards')
        .insert({
          occasion: finalCard.occasion,
          tone: finalCard.tone,
          recipient,
          sender: finalCard.sender,
          length: finalCard.length,
          language: finalCard.language,
          title: finalCard.title,
          content: finalCard.content,
          caption: finalCard.caption,
          giftTag: finalCard.giftTag,
          template: finalCard.template,
          userId: userId || null,
          isFavorite: false
        })
        .select('*')
        .single();

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Map id to _id for frontend compatibility, and add back the imageUrl
      const mappedCard = { _id: savedCard.id, imageUrl: finalCard.imageUrl, ...savedCard };

      // Log Analytics
      await supabase.from('analytics').insert({
        cardId: savedCard.id,
        occasion: finalCard.occasion,
        tone: finalCard.tone,
      });

      return res.status(201).json({
        success: true,
        data: mappedCard,
      });
    } else {
      // Memory Storage Fallback
      const mockId = generateMockId();
      const memorySavedCard = {
        _id: mockId,
        ...finalCard,
        createdAt: new Date(),
      };
      memoryCards.unshift(memorySavedCard);
      
      memoryAnalytics.unshift({
        occasion: finalCard.occasion,
        tone: finalCard.tone,
        date: new Date()
      });

      return res.status(201).json({
        success: true,
        data: memorySavedCard,
        note: "Saved in temporary memory storage (Supabase not connected)",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get All Cards with Filters, Search, and User constraints
export const getCards = async (req, res, next) => {
  try {
    const { search, occasion, tone } = req.query;
    
    if (isSupabaseConfigured()) {
      let queryBuilder = supabase
        .from('greeting_cards')
        .select('*');

      // Regular users only see their own cards. Admins see everything. Guests see guest cards.
      if (req.user) {
        if (req.user.role !== 'admin') {
          queryBuilder = queryBuilder.eq('userId', req.user._id);
        }
      } else {
        queryBuilder = queryBuilder.is('userId', null);
      }

      if (search) {
        queryBuilder = queryBuilder.or(`recipient.ilike.%${search}%,sender.ilike.%${search}%,title.ilike.%${search}%`);
      }

      if (occasion && occasion !== 'All') {
        queryBuilder = queryBuilder.eq('occasion', occasion);
      }

      if (tone && tone !== 'All') {
        queryBuilder = queryBuilder.eq('tone', tone);
      }

      const { data: cards, error } = await queryBuilder.order('createdAt', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const mappedCards = cards.map(c => ({ _id: c.id, ...c }));

      return res.status(200).json({
        success: true,
        count: mappedCards.length,
        data: mappedCards,
      });
    } else {
      // Memory query fallback
      let filteredCards = [...memoryCards];

      // Regular users only see their own cards in memory. Guests see guest cards.
      if (req.user) {
        if (req.user.role !== 'admin') {
          const userIdStr = req.user._id.toString();
          filteredCards = filteredCards.filter((c) => c.userId === userIdStr);
        }
      } else {
        filteredCards = filteredCards.filter((c) => !c.userId);
      }

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
        note: "Data fetched from temporary memory (Supabase not connected)",
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

    if (isSupabaseConfigured()) {
      const { data: card, error } = await supabase
        .from('greeting_cards')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }

      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId !== req.user._id)) {
          res.status(403);
          throw new Error('Not authorized to access this card');
        }
      }

      const mappedCard = { _id: card.id, ...card };

      return res.status(200).json({
        success: true,
        data: mappedCard,
      });
    } else {
      const card = memoryCards.find((c) => c._id === id);
      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }

      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId.toString() !== req.user._id.toString())) {
          res.status(403);
          throw new Error('Not authorized to access this card');
        }
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

    if (isSupabaseConfigured()) {
      const { data: card, error: fetchError } = await supabase
        .from('greeting_cards')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }

      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId !== req.user._id)) {
          res.status(403);
          throw new Error('Not authorized to delete this card');
        }
      }

      await supabase.from('greeting_cards').delete().eq('id', id);
      await supabase.from('analytics').delete().eq('cardId', id);

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

      const card = memoryCards[cardIndex];
      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId.toString() !== req.user._id.toString())) {
          res.status(403);
          throw new Error('Not authorized to delete this card');
        }
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

// Toggle card favorite status
export const toggleFavoriteCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const { data: card, error: fetchError } = await supabase
        .from('greeting_cards')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }

      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId !== req.user._id)) {
          res.status(403);
          throw new Error('Not authorized to update this card');
        }
      }

      const { data: updatedCard, error: updateError } = await supabase
        .from('greeting_cards')
        .update({ isFavorite: !card.isFavorite })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      const mappedCard = { _id: updatedCard.id, ...updatedCard };

      return res.status(200).json({
        success: true,
        data: mappedCard
      });
    } else {
      const card = memoryCards.find((c) => c._id === id);
      if (!card) {
        res.status(404);
        throw new Error('Greeting card not found');
      }

      // Check ownership
      if (card.userId) {
        if (!req.user || (req.user.role !== 'admin' && card.userId.toString() !== req.user._id.toString())) {
          res.status(403);
          throw new Error('Not authorized to update this card');
        }
      }

      card.isFavorite = !card.isFavorite;
      return res.status(200).json({
        success: true,
        data: card,
        note: "Updated in temporary memory storage"
      });
    }
  } catch (error) {
    next(error);
  }
};
